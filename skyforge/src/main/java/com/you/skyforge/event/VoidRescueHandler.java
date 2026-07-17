package com.you.skyforge.event;

import com.you.skyforge.SkyForge;
import net.minecraft.core.BlockPos;
import net.minecraft.resources.ResourceKey;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.event.entity.living.LivingFallEvent;
import net.minecraftforge.event.entity.player.PlayerEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Void rescue: falling out of the world drops you back in from the sky instead of killing you.
 *
 * <p>Rather than dying, the player is caught above the vanilla void-damage threshold, teleported
 * high above the last patch of solid ground they stood on, and allowed to free-fall back down.
 * The landing is made harmless; the fall itself is not slowed, because the drop is the point.
 */
@Mod.EventBusSubscriber(modid = SkyForge.MOD_ID, bus = Mod.EventBusSubscriber.Bus.FORGE)
public final class VoidRescueHandler {

    /**
     * Catch the player this far below the dimension's min build height. Vanilla applies
     * out-of-world damage at minBuildHeight - 64, so this leaves ~32 blocks of margin. At
     * terminal velocity (~3.9 blocks/tick) that is ~8 ticks to notice the fall, which is
     * ample for a per-tick check.
     */
    private static final int CATCH_BELOW_MIN_BUILD = 32;

    /** How far above the recovered ground position to re-insert the player. */
    private static final int DROP_HEIGHT = 200;

    /** Keep the drop this far under the dimension ceiling so we never spawn inside bedrock. */
    private static final int CEILING_MARGIN = 8;

    /** How far to look down from a remembered spot for ground that still exists. */
    private static final int GROUND_SCAN_DEPTH = 12;

    /** Only record a safe spot every N ticks; per-tick block lookups for every player add up. */
    private static final int RECORD_INTERVAL_TICKS = 10;

    /** Last known solid-ground position per player, per dimension. */
    private static final Map<UUID, Map<ResourceKey<Level>, BlockPos>> LAST_SAFE = new HashMap<>();

    /** Players currently falling from a rescue drop, whose landing must not hurt. */
    private static final Set<UUID> FALLING_FROM_RESCUE = new HashSet<>();

    private VoidRescueHandler() {
    }

    @SubscribeEvent
    public static void onPlayerTick(TickEvent.PlayerTickEvent event) {
        if (event.phase != TickEvent.Phase.END) {
            return;
        }
        if (!(event.player instanceof ServerPlayer player)) {
            return;
        }
        if (!(player.level() instanceof ServerLevel level)) {
            return;
        }
        // Spectators pass through the void by design; creative flight is its own safety net,
        // but a creative player who falls still deserves not to die.
        if (player.isSpectator()) {
            return;
        }

        if (player.getY() < level.getMinBuildHeight() - CATCH_BELOW_MIN_BUILD) {
            rescue(player, level);
            return;
        }

        if (player.tickCount % RECORD_INTERVAL_TICKS == 0) {
            recordSafeSpot(player, level);
        }
    }

    /** Remember where the player is standing, so a later void fall has somewhere to return to. */
    private static void recordSafeSpot(ServerPlayer player, ServerLevel level) {
        if (!player.onGround() || player.isPassenger()) {
            return;
        }
        BlockPos pos = player.blockPosition();
        if (pos.getY() < level.getMinBuildHeight()) {
            return;
        }
        LAST_SAFE.computeIfAbsent(player.getUUID(), id -> new HashMap<>())
                .put(level.dimension(), pos);
    }

    private static void rescue(ServerPlayer player, ServerLevel level) {
        BlockPos target = findDropTarget(player, level);

        int dropY = Math.min(
                target.getY() + DROP_HEIGHT,
                level.getMaxBuildHeight() - CEILING_MARGIN);
        // If the remembered ground sits near the ceiling there may be no room to fall; make sure
        // the player still ends up above it rather than inside it.
        dropY = Math.max(dropY, target.getY() + 1);

        player.resetFallDistance();
        player.setDeltaMovement(0.0D, 0.0D, 0.0D);
        player.teleportTo(
                level,
                target.getX() + 0.5D,
                dropY,
                target.getZ() + 0.5D,
                player.getYRot(),
                player.getXRot());
        player.resetFallDistance();

        FALLING_FROM_RESCUE.add(player.getUUID());

        level.playSound(
                null,
                target.getX() + 0.5D,
                dropY,
                target.getZ() + 0.5D,
                SoundEvents.ELYTRA_FLYING,
                SoundSource.PLAYERS,
                0.5F,
                1.0F);
    }

    /**
     * Pick where to drop the player back in. Prefers the last solid ground they stood on in this
     * dimension, but only if that ground still exists -- otherwise a player who mined out the
     * block they were standing on would be dropped straight back into the void, forever.
     */
    private static BlockPos findDropTarget(ServerPlayer player, ServerLevel level) {
        Map<ResourceKey<Level>, BlockPos> perDim = LAST_SAFE.get(player.getUUID());
        if (perDim != null) {
            BlockPos remembered = perDim.get(level.dimension());
            if (remembered != null) {
                BlockPos ground = scanForGround(level, remembered);
                if (ground != null) {
                    return ground;
                }
                // The remembered ground is gone. Forget it so we do not re-check it every fall.
                perDim.remove(level.dimension());
            }
        }

        BlockPos respawn = player.getRespawnPosition();
        if (respawn != null && level.dimension().equals(player.getRespawnDimension())) {
            BlockPos ground = scanForGround(level, respawn);
            if (ground != null) {
                return ground;
            }
        }

        return level.getSharedSpawnPos();
    }

    /**
     * Look for a block with something solid under it, starting at {@code from} and scanning down.
     * Returns null when nothing solid is within {@link #GROUND_SCAN_DEPTH}.
     */
    private static BlockPos scanForGround(ServerLevel level, BlockPos from) {
        for (int i = 0; i <= GROUND_SCAN_DEPTH; i++) {
            BlockPos candidate = from.below(i);
            if (candidate.getY() <= level.getMinBuildHeight()) {
                return null;
            }
            if (!level.getBlockState(candidate.below()).isAir()) {
                return candidate;
            }
        }
        return null;
    }

    /** A rescue drop must never be the thing that kills you. */
    @SubscribeEvent
    public static void onFall(LivingFallEvent event) {
        if (!(event.getEntity() instanceof Player player)) {
            return;
        }
        if (FALLING_FROM_RESCUE.remove(player.getUUID())) {
            event.setDistance(0.0F);
            event.setDamageMultiplier(0.0F);
            event.setCanceled(true);
        }
    }

    @SubscribeEvent
    public static void onLoggedOut(PlayerEvent.PlayerLoggedOutEvent event) {
        UUID id = event.getEntity().getUUID();
        LAST_SAFE.remove(id);
        FALLING_FROM_RESCUE.remove(id);
    }
}
