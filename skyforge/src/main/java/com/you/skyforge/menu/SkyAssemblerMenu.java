package com.you.skyforge.menu;

import com.you.skyforge.blockentity.SkyAssemblerBlockEntity;
import com.you.skyforge.registry.ModBlocks;
import com.you.skyforge.registry.ModMenus;
import net.minecraft.network.FriendlyByteBuf;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.inventory.AbstractContainerMenu;
import net.minecraft.world.inventory.ContainerData;
import net.minecraft.world.inventory.SimpleContainerData;
import net.minecraft.world.inventory.Slot;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraftforge.items.SlotItemHandler;

public class SkyAssemblerMenu extends AbstractContainerMenu {

    private final SkyAssemblerBlockEntity blockEntity;
    private final ContainerData data;

    // Client constructor
    public SkyAssemblerMenu(int id, Inventory inv, FriendlyByteBuf buf) {
        this(id, inv, resolve(inv, buf), new SimpleContainerData(4));
    }

    // Server constructor
    public SkyAssemblerMenu(int id, Inventory inv, BlockEntity be, ContainerData data) {
        super(ModMenus.SKY_ASSEMBLER.get(), id);
        this.blockEntity = (SkyAssemblerBlockEntity) be;
        this.data = data;

        addSlot(new SlotItemHandler(blockEntity.getItems(), SkyAssemblerBlockEntity.SLOT_INPUT, 56, 35));
        addSlot(new SlotItemHandler(blockEntity.getItems(), SkyAssemblerBlockEntity.SLOT_OUTPUT, 116, 35) {
            @Override
            public boolean mayPlace(ItemStack stack) {
                return false;
            }
        });

        addPlayerInventory(inv);
        addDataSlots(data);
    }

    private static BlockEntity resolve(Inventory inv, FriendlyByteBuf buf) {
        return inv.player.level().getBlockEntity(buf.readBlockPos());
    }

    public int getProgress() {
        return data.get(0);
    }

    public int getMaxProgress() {
        return data.get(1);
    }

    public int getEnergy() {
        return data.get(2);
    }

    public int getMaxEnergy() {
        return data.get(3);
    }

    public int getScaledProgress(int pixels) {
        int max = getMaxProgress();
        return max == 0 ? 0 : getProgress() * pixels / max;
    }

    public int getScaledEnergy(int pixels) {
        int max = getMaxEnergy();
        return max == 0 ? 0 : getEnergy() * pixels / max;
    }

    @Override
    public ItemStack quickMoveStack(Player player, int index) {
        Slot slot = slots.get(index);
        if (slot == null || !slot.hasItem()) {
            return ItemStack.EMPTY;
        }
        ItemStack stack = slot.getItem();
        ItemStack copy = stack.copy();
        final int teCount = 2;
        final int invStart = teCount;
        final int invEnd = teCount + 36;

        if (index < teCount) {
            if (!moveItemStackTo(stack, invStart, invEnd, true)) {
                return ItemStack.EMPTY;
            }
        } else {
            if (!moveItemStackTo(stack, SkyAssemblerBlockEntity.SLOT_INPUT, SkyAssemblerBlockEntity.SLOT_INPUT + 1, false)) {
                return ItemStack.EMPTY;
            }
        }

        if (stack.isEmpty()) {
            slot.set(ItemStack.EMPTY);
        } else {
            slot.setChanged();
        }
        return copy;
    }

    @Override
    public boolean stillValid(Player player) {
        return stillValid(net.minecraft.world.inventory.ContainerLevelAccess.create(
                        blockEntity.getLevel(), blockEntity.getBlockPos()),
                player, ModBlocks.SKY_ASSEMBLER.get());
    }

    private void addPlayerInventory(Inventory inv) {
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                addSlot(new Slot(inv, col + row * 9 + 9, 8 + col * 18, 84 + row * 18));
            }
        }
        for (int col = 0; col < 9; col++) {
            addSlot(new Slot(inv, col, 8 + col * 18, 142));
        }
    }
}
