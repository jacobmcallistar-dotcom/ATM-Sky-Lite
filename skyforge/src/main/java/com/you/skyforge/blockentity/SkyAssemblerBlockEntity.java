package com.you.skyforge.blockentity;

import com.you.skyforge.energy.ModEnergyStorage;
import com.you.skyforge.menu.SkyAssemblerMenu;
import com.you.skyforge.registry.ModBlockEntities;
import com.you.skyforge.registry.ModItems;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.network.chat.Component;
import net.minecraft.network.protocol.Packet;
import net.minecraft.network.protocol.game.ClientGamePacketListener;
import net.minecraft.network.protocol.game.ClientboundBlockEntityDataPacket;
import net.minecraft.world.Containers;
import net.minecraft.world.MenuProvider;
import net.minecraft.world.SimpleContainer;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.inventory.AbstractContainerMenu;
import net.minecraft.world.inventory.ContainerData;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.common.capabilities.ForgeCapabilities;
import net.minecraftforge.common.util.LazyOptional;
import net.minecraftforge.energy.IEnergyStorage;
import net.minecraftforge.items.IItemHandler;
import net.minecraftforge.items.ItemStackHandler;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class SkyAssemblerBlockEntity extends BlockEntity implements MenuProvider {

    public static final int SLOT_INPUT = 0;
    public static final int SLOT_OUTPUT = 1;

    private static final int ENERGY_CAPACITY = 100_000;
    private static final int ENERGY_MAX_IO = 2_000;
    private static final int ENERGY_PER_TICK = 200;
    private static final int TOTAL_WORK = 100; // ticks per craft (~5s)

    private final ItemStackHandler items = new ItemStackHandler(2) {
        @Override
        protected void onContentsChanged(int slot) {
            setChanged();
        }

        @Override
        public boolean isItemValid(int slot, @NotNull ItemStack stack) {
            return slot == SLOT_INPUT && stack.is(ModItems.SKY_DUST.get());
        }
    };

    private final ModEnergyStorage energy = new ModEnergyStorage(ENERGY_CAPACITY, ENERGY_MAX_IO, this::setChanged);

    private LazyOptional<IItemHandler> itemCap = LazyOptional.of(() -> items);
    private LazyOptional<IEnergyStorage> energyCap = LazyOptional.of(() -> energy);

    private int progress = 0;

    private final ContainerData data = new ContainerData() {
        @Override
        public int get(int index) {
            return switch (index) {
                case 0 -> progress;
                case 1 -> TOTAL_WORK;
                case 2 -> energy.getEnergyStored();
                case 3 -> energy.getMaxEnergyStored();
                default -> 0;
            };
        }

        @Override
        public void set(int index, int value) {
            if (index == 0) progress = value;
        }

        @Override
        public int getCount() {
            return 4;
        }
    };

    public SkyAssemblerBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.SKY_ASSEMBLER.get(), pos, state);
    }

    public void tick() {
        if (level == null || level.isClientSide()) {
            return;
        }

        boolean changed = false;
        if (canCraft() && energy.getEnergyStored() >= ENERGY_PER_TICK) {
            if (energy.consume(ENERGY_PER_TICK)) {
                progress++;
                changed = true;
                if (progress >= TOTAL_WORK) {
                    craft();
                    progress = 0;
                }
            }
        } else if (progress != 0) {
            progress = 0;
            changed = true;
        }

        if (changed) {
            setChanged();
            level.sendBlockUpdated(worldPosition, getBlockState(), getBlockState(), 3);
        }
    }

    private boolean canCraft() {
        ItemStack in = items.getStackInSlot(SLOT_INPUT);
        if (in.isEmpty() || !in.is(ModItems.SKY_DUST.get())) {
            return false;
        }
        ItemStack out = items.getStackInSlot(SLOT_OUTPUT);
        return out.isEmpty()
                || (out.is(ModItems.SKY_STEEL_INGOT.get()) && out.getCount() < out.getMaxStackSize());
    }

    private void craft() {
        items.extractItem(SLOT_INPUT, 1, false);
        ItemStack out = items.getStackInSlot(SLOT_OUTPUT);
        if (out.isEmpty()) {
            items.setStackInSlot(SLOT_OUTPUT, new ItemStack(ModItems.SKY_STEEL_INGOT.get()));
        } else {
            out.grow(1);
        }
    }

    public void dropContents(Level level, BlockPos pos) {
        SimpleContainer inv = new SimpleContainer(items.getSlots());
        for (int i = 0; i < items.getSlots(); i++) {
            inv.setItem(i, items.getStackInSlot(i));
        }
        Containers.dropContents(level, pos, inv);
    }

    @NotNull
    @Override
    public <T> LazyOptional<T> getCapability(@NotNull Capability<T> cap, @Nullable Direction side) {
        if (cap == ForgeCapabilities.ITEM_HANDLER) {
            return itemCap.cast();
        }
        if (cap == ForgeCapabilities.ENERGY) {
            return energyCap.cast();
        }
        return super.getCapability(cap, side);
    }

    @Override
    public void invalidateCaps() {
        super.invalidateCaps();
        itemCap.invalidate();
        energyCap.invalidate();
    }

    @Override
    public void reviveCaps() {
        super.reviveCaps();
        itemCap = LazyOptional.of(() -> items);
        energyCap = LazyOptional.of(() -> energy);
    }

    @Override
    protected void saveAdditional(CompoundTag tag) {
        super.saveAdditional(tag);
        tag.put("Items", items.serializeNBT());
        tag.putInt("Energy", energy.getEnergyStored());
        tag.putInt("Progress", progress);
    }

    @Override
    public void load(CompoundTag tag) {
        super.load(tag);
        items.deserializeNBT(tag.getCompound("Items"));
        energy.setEnergy(tag.getInt("Energy"));
        progress = tag.getInt("Progress");
    }

    @Override
    public CompoundTag getUpdateTag() {
        CompoundTag tag = super.getUpdateTag();
        saveAdditional(tag);
        return tag;
    }

    @Nullable
    @Override
    public Packet<ClientGamePacketListener> getUpdatePacket() {
        return ClientboundBlockEntityDataPacket.create(this);
    }

    public ItemStackHandler getItems() {
        return items;
    }

    public ContainerData getData() {
        return data;
    }

    @Override
    public Component getDisplayName() {
        return Component.translatable("block.skyforge.sky_assembler");
    }

    @Nullable
    @Override
    public AbstractContainerMenu createMenu(int id, Inventory inv, Player player) {
        return new SkyAssemblerMenu(id, inv, this, data);
    }
}
