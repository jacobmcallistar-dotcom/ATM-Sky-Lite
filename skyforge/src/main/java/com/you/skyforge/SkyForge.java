package com.you.skyforge;

import com.you.skyforge.registry.ModBlockEntities;
import com.you.skyforge.registry.ModBlocks;
import com.you.skyforge.registry.ModCreativeTabs;
import com.you.skyforge.registry.ModItems;
import com.you.skyforge.registry.ModMenus;
import com.you.skyforge.screen.SkyAssemblerScreen;
import net.minecraft.client.gui.screens.MenuScreens;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(SkyForge.MOD_ID)
public class SkyForge {
    public static final String MOD_ID = "skyforge";

    public SkyForge() {
        IEventBus bus = FMLJavaModLoadingContext.get().getModEventBus();

        ModItems.ITEMS.register(bus);
        ModBlocks.BLOCKS.register(bus);
        ModBlockEntities.BLOCK_ENTITIES.register(bus);
        ModMenus.MENUS.register(bus);
        ModCreativeTabs.TABS.register(bus);

        // Mystical Agriculture crops are not registered from here: MA discovers
        // com.you.skyforge.compat.MysticalCrops via its @MysticalAgriculturePlugin annotation
        // and calls it during its own crop-registration window.

        bus.addListener(this::clientSetup);
    }

    private void clientSetup(final FMLClientSetupEvent event) {
        // MenuScreens.register is the 1.20.1 way to bind a menu to its screen.
        event.enqueueWork(() ->
                MenuScreens.register(ModMenus.SKY_ASSEMBLER.get(), SkyAssemblerScreen::new));
    }
}
