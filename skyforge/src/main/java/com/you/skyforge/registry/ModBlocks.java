package com.you.skyforge.registry;

import com.you.skyforge.SkyForge;
import com.you.skyforge.block.SkyAssemblerBlock;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.MapColor;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

import java.util.function.Supplier;

public class ModBlocks {
    public static final DeferredRegister<Block> BLOCKS =
            DeferredRegister.create(ForgeRegistries.BLOCKS, SkyForge.MOD_ID);

    public static final RegistryObject<Block> SKY_ASSEMBLER =
            registerBlock("sky_assembler",
                    () -> new SkyAssemblerBlock(BlockBehaviour.Properties.of()
                            .mapColor(MapColor.METAL)
                            .requiresCorrectToolForDrops()
                            .strength(3.5F)
                            .noOcclusion()));

    private static <T extends Block> RegistryObject<T> registerBlock(String name, Supplier<T> block) {
        RegistryObject<T> toReturn = BLOCKS.register(name, block);
        ModItems.ITEMS.register(name, () -> new BlockItem(toReturn.get(), new Item.Properties()));
        return toReturn;
    }
}
