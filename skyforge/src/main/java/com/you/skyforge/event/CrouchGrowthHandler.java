package com.you.skyforge.event;

import com.you.skyforge.SkyForge;
import net.minecraft.core.BlockPos;
import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.util.RandomSource;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.BonemealableBlock;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.event.entity.player.PlayerEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

import java.lang.reflect.Method;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Crouch-to-grow: while a player holds sneak, crops around them receive a bone-meal growth pulse --
 * no bone meal item required. The crouch itself is the fertilizer.
 *
 * <p>Growth goes through the vanilla {@link BonemealableBlock} path ({@code isValidBonemealTarget}
 * then {@code performBonemeal}), so every block decides for itself whether it accepts the pulse,
 * exactly as if a bone meal item had been used. Blocks that reject bone meal are untouched.
 *
 * <p><b>Feedback:</b> successful growth spawns the vanilla bone-meal particles and <em>no sound</em>.
 * Vanilla's {@code levelEvent(1505, ...)} fires particles and the bone-meal sound together, so it is
 * deliberately not used here -- the particles are sent directly instead. Sneaking is held down for
 * long stretches, and a sound on every pulse would be unbearable.
 *
 * <p><b>Reliability:</b> the pulse is deterministic. Vanilla's {@code isBonemealSuccess} is a random
 * roll (saplings succeed only ~45% of the time), which made crouching feel broken rather than slow,
 * so it is not consulted -- if a block is a valid bone-meal target, it grows.
 *
 * <p><b>One pulse per crouch, not per tick.</b> Growth fires on the moment sneak is <em>pressed</em>,
 * and holding it does nothing further. Sneak is ordinary movement -- edging along a block, walking
 * down stairs, not falling off the island -- so a handler that fires while sneak is merely held grows
 * everything around you as a side effect of getting about, which is both surprising and impossible to
 * aim. Requiring a fresh press per stage means you spam crouch to grow deliberately, and incidental
 * sneaking costs at most a single stage.
 *
 * <p><b>Mystical Agriculture is limited by tier, not banned outright.</b> Crops below
 * {@link #MA_EXCLUDED_FROM_TIER} (Imperium) respond to crouching; Imperium and above do not, so the
 * early essence grind is fast without trivialising endgame essence. The tier is read reflectively
 * from Mystical Agriculture's own API, so this class still loads when that mod is absent -- in which
 * case, or if the API ever changes shape, it falls back to excluding the whole namespace.
 */
@Mod.EventBusSubscriber(modid = SkyForge.MOD_ID, bus = Mod.EventBusSubscriber.Bus.FORGE)
public final class CrouchGrowthHandler {

    /**
     * Horizontal reach of the pulse, in blocks, measured from the player's own column. Deliberately
     * tight: a radius of 1 covers the 3x3 you are standing in, so a crouch grows what is at your feet
     * rather than a whole field you happened to be near. Wider reaches made the effect impossible to
     * aim and surprising to trigger.
     */
    private static final int HORIZONTAL_RADIUS = 1;

    /** Vertical reach above and below the player's feet -- enough to catch crops on a step or ledge. */
    private static final int VERTICAL_RADIUS = 1;

    /**
     * Mystical Agriculture crop tier from which crouch growth stops working, inclusive.
     * MA tiers run 1 Inferium, 2 Prudentium, 3 Tertium, 4 Imperium, 5 Supremium -- so 4 means
     * Inferium/Prudentium/Tertium grow, Imperium and Supremium do not.
     */
    private static final int MA_EXCLUDED_FROM_TIER = 4;

    private static final String MA_NAMESPACE = "mysticalagriculture";

    /**
     * Mystical Agradditions registers only Insanium, which sits above Supremium, so the whole
     * namespace is excluded outright -- there is no tier in it that should respond to crouching.
     */
    private static final Set<String> ALWAYS_EXCLUDED_NAMESPACES = Set.of("mysticalagradditions");

    /** Bone-meal particle count per grown block, matching roughly what a bone meal item produces. */
    private static final int PARTICLE_COUNT = 6;

    /**
     * Players whose sneak key was already down last tick. Used to fire growth only on the
     * press edge -- an entry is added when sneak goes down and dropped the moment it comes up,
     * so a held crouch never pulses twice.
     */
    private static final Set<UUID> SNEAK_HELD = ConcurrentHashMap.newKeySet();

    // --- Mystical Agriculture API, resolved reflectively exactly once -------------------------

    private static boolean maReflectionAttempted;
    private static Class<?> maCropProviderClass;
    private static Method maGetCrop;
    private static Method maGetTier;
    private static Method maGetTierValue;

    private CrouchGrowthHandler() {
    }

    @SubscribeEvent
    public static void onPlayerTick(TickEvent.PlayerTickEvent event) {
        if (event.phase != TickEvent.Phase.END) {
            return;
        }
        if (!(event.player instanceof ServerPlayer player)) {
            return;
        }

        UUID id = player.getUUID();
        if (!player.isShiftKeyDown() || player.isSpectator()) {
            SNEAK_HELD.remove(id);
            return;
        }
        // add() is false if the key was already down last tick -- i.e. this is a hold, not a press.
        if (!SNEAK_HELD.add(id)) {
            return;
        }
        if (!(player.level() instanceof ServerLevel level)) {
            return;
        }

        RandomSource random = level.getRandom();
        BlockPos feet = player.blockPosition();

        for (int dx = -HORIZONTAL_RADIUS; dx <= HORIZONTAL_RADIUS; dx++) {
            for (int dz = -HORIZONTAL_RADIUS; dz <= HORIZONTAL_RADIUS; dz++) {
                for (int dy = -VERTICAL_RADIUS; dy <= VERTICAL_RADIUS; dy++) {
                    tryGrow(level, random, feet.offset(dx, dy, dz));
                }
            }
        }
    }

    /**
     * Drop a disconnecting player's sneak state. Without this, anyone who logs out while crouched
     * leaves a stale entry behind and their first crouch after logging back in is swallowed.
     */
    @SubscribeEvent
    public static void onPlayerLoggedOut(PlayerEvent.PlayerLoggedOutEvent event) {
        SNEAK_HELD.remove(event.getEntity().getUUID());
    }

    /** Apply one bone-meal pulse at {@code pos} if the block there is a growable, permitted crop. */
    private static void tryGrow(ServerLevel level, RandomSource random, BlockPos pos) {
        BlockState state = level.getBlockState(pos);
        if (!(state.getBlock() instanceof BonemealableBlock bonemealable)) {
            return;
        }
        if (isExcluded(state)) {
            return;
        }
        if (!bonemealable.isValidBonemealTarget(level, pos, state, false)) {
            return;
        }

        bonemealable.performBonemeal(level, random, pos, state);
        spawnGrowthParticles(level, pos);
    }

    /**
     * Bone-meal particles with no sound. Sent straight to watching clients rather than via
     * {@code levelEvent(1505, ...)}, which would also play the bone-meal sound.
     */
    private static void spawnGrowthParticles(ServerLevel level, BlockPos pos) {
        level.sendParticles(
                ParticleTypes.HAPPY_VILLAGER,
                pos.getX() + 0.5D,
                pos.getY() + 0.5D,
                pos.getZ() + 0.5D,
                PARTICLE_COUNT,
                0.3D, 0.3D, 0.3D,
                0.0D);
    }

    private static boolean isExcluded(BlockState state) {
        Block block = state.getBlock();
        ResourceLocation id = BuiltInRegistries.BLOCK.getKey(block);
        String namespace = id.getNamespace();

        if (ALWAYS_EXCLUDED_NAMESPACES.contains(namespace)) {
            return true;
        }
        if (!MA_NAMESPACE.equals(namespace)) {
            return false;
        }

        Integer tier = mysticalCropTier(block);
        if (tier == null) {
            // Tier unreadable (API absent or changed) -- fall back to the old blanket exclusion
            // rather than risk letting an endgame essence crop through.
            return true;
        }
        return tier >= MA_EXCLUDED_FROM_TIER;
    }

    /** @return the crop's Mystical Agriculture tier, or {@code null} if it cannot be determined. */
    private static Integer mysticalCropTier(Block block) {
        resolveMysticalApi();
        if (maCropProviderClass == null || !maCropProviderClass.isInstance(block)) {
            return null;
        }
        try {
            Object crop = maGetCrop.invoke(block);
            if (crop == null) {
                return null;
            }
            Object tier = maGetTier.invoke(crop);
            if (tier == null) {
                return null;
            }
            return (Integer) maGetTierValue.invoke(tier);
        } catch (ReflectiveOperationException | ClassCastException e) {
            return null;
        }
    }

    private static void resolveMysticalApi() {
        if (maReflectionAttempted) {
            return;
        }
        maReflectionAttempted = true;
        try {
            maCropProviderClass = Class.forName("com.blakebr0.mysticalagriculture.api.crop.ICropProvider");
            Class<?> cropClass = Class.forName("com.blakebr0.mysticalagriculture.api.crop.Crop");
            Class<?> tierClass = Class.forName("com.blakebr0.mysticalagriculture.api.crop.CropTier");
            maGetCrop = maCropProviderClass.getMethod("getCrop");
            maGetTier = cropClass.getMethod("getTier");
            maGetTierValue = tierClass.getMethod("getValue");
        } catch (ReflectiveOperationException e) {
            maCropProviderClass = null;
            maGetCrop = null;
            maGetTier = null;
            maGetTierValue = null;
        }
    }
}
