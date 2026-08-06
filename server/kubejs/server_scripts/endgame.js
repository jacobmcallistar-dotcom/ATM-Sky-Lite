// ATM Sky Lite - Endgame hardening
// ---------------------------------------------------------------------------
// Heart of the Sky (skyforge:heart_of_the_sky) is the win condition. As shipped
// it needed seven boss kills - but all of them from BOMD, Cataclysm and the
// Wither. You could finish the pack without ever opening a Twilight portal or
// launching a rocket, which made two whole progression trees optional.
//
// This script inserts the Celestial Core in place of the Nether Star at the
// centre of that recipe. The Core itself costs five Twilight Forest boss
// trophies and one metal from each of the three planets, so finishing now
// requires clearing BOTH adventure trees.
//
// Total cost of the ending after this change:
//   Twilight Forest : Naga, Lich, Hydra, Ur-Ghast, Snow Queen   (5 bosses)
//   Ad Astra        : Moon, Mars, Venus                          (3 worlds)
//   Void Signal     : Lich, Obsidilith, Gauntlet, Void Blossom   (4 bosses)
//   Cataclysm       : Netherite Monstrosity, Ignis               (2 bosses)
//   Vanilla         : Wither                                     (1 boss)
//   Mekanism        : 2x Antimatter Pellet (SPS)
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // -------------------------------------------------------------------------
  // The Celestial Core.
  // Trophies only drop from the boss itself, so each one is a guaranteed kill -
  // they cannot be farmed, traded or sieved.
  // -------------------------------------------------------------------------
  event.shaped('kubejs:celestial_core', [
    'NHU',
    'DSO',
    'LCQ'
  ], {
    N: 'twilightforest:naga_trophy',
    H: 'twilightforest:hydra_trophy',
    U: 'twilightforest:ur_ghast_trophy',
    D: 'ad_astra:desh_ingot',
    S: 'minecraft:nether_star',
    O: 'ad_astra:ostrum_ingot',
    L: 'twilightforest:lich_trophy',
    C: 'ad_astra:calorite_ingot',
    Q: 'twilightforest:snow_queen_trophy'
  }).id('kubejs:celestial_core')

  // -------------------------------------------------------------------------
  // Swap the Nether Star out of the Heart of the Sky for the Core.
  // The recipe shape is untouched - only the centre ingredient changes - so
  // SkyForge's own datapack recipe keeps working exactly as written.
  // -------------------------------------------------------------------------
  try {
    event.replaceInput(
      { id: 'skyforge:heart_of_the_sky' },
      'minecraft:nether_star',
      'kubejs:celestial_core'
    )
    console.log('[endgame] Heart of the Sky centre: nether_star -> kubejs:celestial_core')
  } catch (err) {
    console.error(`[endgame] FAILED to gate Heart of the Sky: ${err}`)
  }

  console.log('[endgame] endgame hardening applied')
})
