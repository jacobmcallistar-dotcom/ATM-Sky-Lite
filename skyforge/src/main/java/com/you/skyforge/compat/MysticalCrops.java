package com.you.skyforge.compat;

import com.blakebr0.mysticalagriculture.api.IMysticalAgriculturePlugin;
import com.blakebr0.mysticalagriculture.api.MysticalAgriculturePlugin;
import com.blakebr0.mysticalagriculture.api.crop.Crop;
import com.blakebr0.mysticalagriculture.api.crop.CropTextures;
import com.blakebr0.mysticalagriculture.api.crop.CropTier;
import com.blakebr0.mysticalagriculture.api.crop.CropType;
import com.blakebr0.mysticalagriculture.api.lib.LazyIngredient;
import com.blakebr0.mysticalagriculture.api.registry.ICropRegistry;
import com.you.skyforge.SkyForge;
import net.minecraft.resources.ResourceLocation;
import net.minecraftforge.fml.ModList;

/**
 * Registers Mystical Agriculture Resource Crops for the Ad Astra planet ores.
 *
 * <p>Without these, desh / ostrum / calorite are the only progression resources in the pack with
 * no automation path at all -- there is no quarry or mining mod installed, so the space tier
 * would stay hand-mined forever. Seeds close that gap.
 *
 * <p>Registration must happen inside {@link #onRegisterCrops}: Mystical Agriculture only accepts
 * crops during that window and merely logs an error and skips anything registered outside it,
 * which fails silently rather than crashing. MA discovers this class by scanning for the
 * {@link MysticalAgriculturePlugin} annotation and instantiates it reflectively, so it needs a
 * public no-arg constructor -- and it is only ever loaded when MA is present.
 *
 * <p>Note the resulting item ids: MA hardcodes its own namespace when it builds the seed and
 * essence for a crop, so these register as {@code mysticalagriculture:desh_seeds} and
 * {@code mysticalagriculture:desh_essence}, NOT under {@code skyforge:} -- despite the crop id
 * below being ours. Anything referencing them (quests, recipes) must use that namespace.
 */
@MysticalAgriculturePlugin
public class MysticalCrops implements IMysticalAgriculturePlugin {

    private static final String AD_ASTRA = "ad_astra";

    @Override
    public void onRegisterCrops(ICropRegistry registry) {
        // The crops exist purely to farm Ad Astra's ores; without that mod they are pointless
        // and their LazyIngredients would resolve to nothing.
        if (!ModList.get().isLoaded(AD_ASTRA)) {
            return;
        }

        // Tiers follow the Ad Astra travel order: Moon -> Mars -> Venus.
        // Colours approximate each ingot; MA tints the blank ingot textures with them, so this
        // needs no custom art.
        registry.register(crop("desh",     CropTier.FOUR, 0x4FA3A5, "ad_astra:desh_ingot"));
        registry.register(crop("ostrum",   CropTier.FIVE, 0x8E3B46, "ad_astra:ostrum_ingot"));
        registry.register(crop("calorite", CropTier.FIVE, 0xE0563C, "ad_astra:calorite_ingot"));
    }

    private static Crop crop(String name, CropTier tier, int color, String ingotId) {
        Crop crop = new Crop(
                new ResourceLocation(SkyForge.MOD_ID, name),
                tier,
                CropType.RESOURCE,
                CropTextures.INGOT_CROP_TEXTURES,
                LazyIngredient.item(ingotId));
        crop.setColor(color);
        return crop;
    }
}
