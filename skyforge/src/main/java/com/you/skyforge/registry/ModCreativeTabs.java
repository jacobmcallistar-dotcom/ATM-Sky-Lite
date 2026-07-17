package com.you.skyforge.registry;

import com.you.skyforge.SkyForge;
import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.ItemStack;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.RegistryObject;

public class ModCreativeTabs {
    public static final DeferredRegister<CreativeModeTab> TABS =
            DeferredRegister.create(Registries.CREATIVE_MODE_TAB, SkyForge.MOD_ID);

    public static final RegistryObject<CreativeModeTab> SKYFORGE_TAB = TABS.register("skyforge",
            () -> CreativeModeTab.builder()
                    .title(Component.translatable("itemGroup.skyforge"))
                    .icon(() -> new ItemStack(ModItems.SKY_STEEL_INGOT.get()))
                    .displayItems((params, output) -> {
                        output.accept(ModItems.SKY_DUST.get());
                        output.accept(ModItems.SKY_STEEL_INGOT.get());
                        output.accept(ModItems.INDUSTRIAL_KEYSTONE.get());
                        output.accept(ModItems.HEART_OF_THE_SKY.get());
                        output.accept(ModBlocks.SKY_ASSEMBLER.get());
                    })
                    .build());
}
