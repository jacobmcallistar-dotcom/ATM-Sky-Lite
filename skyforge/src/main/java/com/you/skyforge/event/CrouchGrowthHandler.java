package com.you.skyforge.event;

import com.you.skyforge.SkyForge;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.util.RandomSource;
import net.minecraft.world.level.block.BonemealableBlock;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

import java.util.Set;

/**
 * Crouch-to-grow: while a player holds sneak, crops around them receive a bone-meal growth pulse --
 * no bone meal item required. The crouch itself is the fertilizer.
 *
 * <p>Growth goes through the vanilla {@link BonemealableBlock} path ({@code isValidBonemealTarget}
 * then {@code performBonemeal}), so every block decides for itself whether it accepts the pulse,
 * exactly as if a bone meal item had been used. Blocks that reject bone meal are untouched.
 *
 * <p><b>Mystical Agriculture is excluded outright.</b> Its resource crops -- including the desh /
 * ostrum / calorite crops SkyForge itself registers, which all live under the
 * {@code mysticalagriculture} namespace -- are skipped before the bone-meal path is even attempted,
 * so no essence crop of any tier can be cheesed by standing on it and sneaking. This namespace check
 * needs no Mystical Agriculture classes, so the handler stays safe to load when that mod is absent.
 */
@Mod.EventBusSubscriber(modid = SkyForge.MOD_ID, bus = Mod.EventBusSubscriber.Bus.FORGE)
public final class CrouchGrowthHandler {

    /** Only pulse every N ticks; scanning a volume of blocks for every sneaking player adds up. */
    private static final int GROW_INTERVAL_TICKS = 10;

    /** Horizontal reach of the pulse, in blocks, measured from the player's own column. */
    private static final int HORIZONTAL_RADIUS = 3;

    /** Vertical reach above and below the player's feet -- enough to catch crops on a step or ledge. */
    private static final int VERTICAL_RADIUS = 1;

    /**
     * Namespaces whose crops must never respond to the crouch pulse. Mystical Agriculture and its
     * add-on register essence crops here (and MA hardcodes its own namespace even for crops other
     * mods register), so excluding these two guarantees no essence crop -- low or high tier -- grows.
     */
    private static final Set<String> EXCLUDED_NAMESPACES = Set.of(
            "mysticalagriculture",
            "mysticalagradditions");

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
        if (!player.isShiftKeyDown() || player.isSpectator()) {
            return;
        }
        if (player.tickCount % GROW_INTERVAL_TICKS != 0) {
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

    /** Apply one bone-meal pulse at {@code pos} if the block there is a growable, non-excluded crop. */
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
        if (!bonemealable.isBonemealSuccess(level, random, pos, state)) {
            return;
        }
        bonemealable.performBonemeal(level, random, pos, state);
    }

    private static boolean isExcluded(BlockState state) {
        ResourceLocation id = BuiltInRegistries.BLOCK.getKey(state.getBlock());
        return EXCLUDED_NAMESPACES.contains(id.getNamespace());
    }
}
