package com.you.skyforge.energy;

import net.minecraftforge.energy.EnergyStorage;

/**
 * Forge Energy (FE) storage that notifies the owning block entity on change so it
 * can mark itself dirty and sync. Accepts power from Mekanism/AE2/anything on the
 * unified Forge Energy capability.
 */
public class ModEnergyStorage extends EnergyStorage {
    private final Runnable onChanged;

    public ModEnergyStorage(int capacity, int maxTransfer, Runnable onChanged) {
        super(capacity, maxTransfer, maxTransfer, 0);
        this.onChanged = onChanged;
    }

    @Override
    public int receiveEnergy(int toReceive, boolean simulate) {
        int received = super.receiveEnergy(toReceive, simulate);
        if (received > 0 && !simulate) {
            onChanged.run();
        }
        return received;
    }

    /** Internal drain used by the machine while crafting. */
    public boolean consume(int amount) {
        if (energy < amount) {
            return false;
        }
        energy -= amount;
        onChanged.run();
        return true;
    }

    public void setEnergy(int value) {
        this.energy = Math.max(0, Math.min(capacity, value));
    }
}
