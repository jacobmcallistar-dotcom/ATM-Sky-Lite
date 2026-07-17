package com.you.skyforge.registry;

import com.you.skyforge.SkyForge;
import net.minecraft.world.item.Item;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModItems {
    public static final DeferredRegister<Item> ITEMS =
            DeferredRegister.create(ForgeRegistries.ITEMS, SkyForge.MOD_ID);

    // Progression chain: sky_dust (from Ex Nihilo sieve) -> compressed via assembler -> sky_steel_ingot
    public static final RegistryObject<Item> SKY_DUST =
            ITEMS.register("sky_dust", () -> new Item(new Item.Properties()));

    public static final RegistryObject<Item> SKY_STEEL_INGOT =
            ITEMS.register("sky_steel_ingot", () -> new Item(new Item.Properties()));

    // Cross-mod "keystone" — recipes for Mekanism/AE2 starter blocks gate behind this.
    public static final RegistryObject<Item> INDUSTRIAL_KEYSTONE =
            ITEMS.register("industrial_keystone", () -> new Item(new Item.Properties().stacksTo(16)));

    // Endgame trophy — crafting this is the pack's win condition.
    public static final RegistryObject<Item> HEART_OF_THE_SKY =
            ITEMS.register("heart_of_the_sky", () -> new Item(
                    new Item.Properties().stacksTo(1).fireResistant().rarity(net.minecraft.world.item.Rarity.EPIC)) {
                @Override
                public boolean isFoil(net.minecraft.world.item.ItemStack stack) {
                    return true;
                }
            });
}
