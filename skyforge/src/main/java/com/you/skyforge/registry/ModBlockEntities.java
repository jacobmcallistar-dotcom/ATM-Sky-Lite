package com.you.skyforge.registry;

import com.you.skyforge.SkyForge;
import com.you.skyforge.blockentity.SkyAssemblerBlockEntity;
import net.minecraft.world.level.block.entity.BlockEntityType;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModBlockEntities {
    public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES =
            DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, SkyForge.MOD_ID);

    public static final RegistryObject<BlockEntityType<SkyAssemblerBlockEntity>> SKY_ASSEMBLER =
            BLOCK_ENTITIES.register("sky_assembler",
                    () -> BlockEntityType.Builder.of(
                            SkyAssemblerBlockEntity::new,
                            ModBlocks.SKY_ASSEMBLER.get()).build(null));
}
