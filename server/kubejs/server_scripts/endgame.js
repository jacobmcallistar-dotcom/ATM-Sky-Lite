// ATM Sky Lite - Endgame hardening
// ---------------------------------------------------------------------------
// Heart of the Sky (skyforge:heart_of_the_sky) is the win condition. As shipped
// it needed seven boss kills - but all of them from BOMD, Cataclysm and the
// Wither. You could finish the pack without ever opening an adventure portal or
// launching a rocket, which made two whole progression trees optional.
//
// This script inserts the Celestial Core in place of the Nether Star at the
// centre of that recipe. The Core costs the adventure dimension's entire boss
// ladder plus one metal from each of the three planets, so finishing now
// requires clearing BOTH adventure trees.
//
// TWILIGHT FOREST -> THE AETHER  (2026-08-11)
// -------------------------------------------
// The Core used to cost five Twilight Forest trophies. TF was removed from the
// pack; the Aether replaced it. The Aether has three bosses, and Deep Aether
// adds a fourth, so four of the five old trophy slots map straight across onto
// dungeon keys:
//
//     Naga trophy       -> aether:bronze_dungeon_key      (Slider)
//     Lich trophy       -> aether:silver_dungeon_key      (Valkyrie Queen)
//     Hydra trophy      -> aether:gold_dungeon_key        (Sun Spirit)
//     Ur-Ghast trophy   -> deep_aether:brass_dungeon_key  (Eye of the Storm)
//     Snow Queen trophy -> cataclysm:monstrous_horn       (Netherite Monstrosity)
//
// The fifth slot went to Cataclysm rather than the Aether because the Aether
// simply has no fifth boss. Ad Astra was considered and rejected - it ships no
// entity loot tables at all, so it has no bosses to gate on; it is already
// represented here by its three planet metals, which are travel gates.
//
// Why keys and not gear: a dungeon key is ONE guaranteed drop from the boss
// itself, with no chance roll (verified in the mods' loot tables). Dungeon
// reward chests are random rolls, so gating a mandatory recipe on them could
// demand a dozen clears. Keys cannot be sieved, traded, bred or duplicated, and
// Aether dungeons keep generating, so another key always costs another fight.
//
// Total cost of the ending after this change:
//   The Aether      : Slider, Valkyrie Queen, Sun Spirit         (3 bosses)
//   Deep Aether     : Eye of the Storm                           (1 boss)
//   Ad Astra        : Moon, Mars, Venus                          (3 worlds)
//   Void Signal     : Lich, Obsidilith, Gauntlet, Void Blossom   (4 bosses)
//   Cataclysm       : Netherite Monstrosity, Ignis               (2 bosses)
//   Vanilla         : Wither                                     (1 boss)
//   Mekanism        : 2x Antimatter Pellet (SPS)
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // -------------------------------------------------------------------------
  // The Celestial Core.
  // Keys and the Monstrous Horn only drop from the boss itself, so each one is
  // a guaranteed kill - they cannot be farmed, traded or sieved.
  //
  //     B M G      B = Bronze Key    M = Monstrous Horn   G = Gold Key
  //     D S O      D = Desh          S = Nether Star      O = Ostrum
  //     V C R      V = Silver Key    C = Calorite         R = Brass Key
  //
  // Adventure bosses ring the outside; the three planets and the Wither's star
  // run through the middle.
  // -------------------------------------------------------------------------
  event.shaped('kubejs:celestial_core', [
    'BMG',
    'DSO',
    'VCR'
  ], {
    B: 'aether:bronze_dungeon_key',
    M: 'cataclysm:monstrous_horn',
    G: 'aether:gold_dungeon_key',
    D: 'ad_astra:desh_ingot',
    S: 'minecraft:nether_star',
    O: 'ad_astra:ostrum_ingot',
    V: 'aether:silver_dungeon_key',
    C: 'ad_astra:calorite_ingot',
    R: 'deep_aether:brass_dungeon_key'
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

  console.log('[endgame] endgame hardening applied (Aether ladder)')
})
