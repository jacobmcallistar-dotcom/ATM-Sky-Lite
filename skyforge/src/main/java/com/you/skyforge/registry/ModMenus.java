package com.you.skyforge.registry;

import com.you.skyforge.SkyForge;
import com.you.skyforge.menu.SkyAssemblerMenu;
import net.minecraft.world.inventory.MenuType;
import net.minecraftforge.common.extensions.IForgeMenuType;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModMenus {
    public static final DeferredRegister<MenuType<?>> MENUS =
            DeferredRegister.create(ForgeRegistries.MENU_TYPES, SkyForge.MOD_ID);

    public static final RegistryObject<MenuType<SkyAssemblerMenu>> SKY_ASSEMBLER =
            MENUS.register("sky_assembler",
                    () -> IForgeMenuType.create(SkyAssemblerMenu::new));
}
