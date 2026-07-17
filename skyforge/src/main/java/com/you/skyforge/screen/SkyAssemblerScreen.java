package com.you.skyforge.screen;

import com.mojang.blaze3d.systems.RenderSystem;
import com.you.skyforge.SkyForge;
import com.you.skyforge.menu.SkyAssemblerMenu;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.player.Inventory;

public class SkyAssemblerScreen extends AbstractContainerScreen<SkyAssemblerMenu> {

    private static final ResourceLocation TEXTURE =
            new ResourceLocation(SkyForge.MOD_ID, "textures/gui/sky_assembler.png");

    public SkyAssemblerScreen(SkyAssemblerMenu menu, Inventory inv, Component title) {
        super(menu, inv, title);
    }

    @Override
    protected void renderBg(GuiGraphics g, float partialTick, int mouseX, int mouseY) {
        RenderSystem.setShaderColor(1f, 1f, 1f, 1f);
        int x = leftPos;
        int y = topPos;
        g.blit(TEXTURE, x, y, 0, 0, imageWidth, imageHeight);

        // progress arrow (24px wide) at slot gap
        int prog = menu.getScaledProgress(24);
        g.blit(TEXTURE, x + 79, y + 34, 176, 14, prog, 17);

        // energy bar (52px tall) on the left
        int e = menu.getScaledEnergy(52);
        g.blit(TEXTURE, x + 10, y + 16 + (52 - e), 176, 31 + (52 - e), 12, e);
    }

    @Override
    protected void renderLabels(GuiGraphics g, int mouseX, int mouseY) {
        super.renderLabels(g, mouseX, mouseY);
        int mx = mouseX - leftPos;
        int my = mouseY - topPos;
        if (mx >= 10 && mx <= 22 && my >= 16 && my <= 68) {
            g.renderTooltip(font,
                    Component.literal(menu.getEnergy() + " / " + menu.getMaxEnergy() + " FE"),
                    mouseX - leftPos, mouseY - topPos);
        }
    }

    @Override
    public void render(GuiGraphics g, int mouseX, int mouseY, float partialTick) {
        renderBackground(g);
        super.render(g, mouseX, mouseY, partialTick);
        renderTooltip(g, mouseX, mouseY);
    }
}
