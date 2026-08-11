// ATM Sky Lite - Adventure Gating  (REBALANCED)
// ---------------------------------------------------------------------------
// Every gate swaps ONE ingredient of an existing recipe for a material that can
// only be obtained by killing a boss or flying to a planet. The recipe SHAPE is
// never changed, so JEI still shows a familiar layout.
//
// WHY THIS WAS REBALANCED
// -----------------------
// The first version gated the ME CONTROLLER behind the Naga. That sounds mild
// until you follow the whole chain, because the Twilight portal is itself
// locked behind the Moon:
//
//     Wither -> NASA Workbench -> rocket -> Moon -> Twilight portal unlocks
//       -> fight to the Naga -> kill it -> only THEN can you build a Controller
//
// A full space program, to unlock basic storage. That is inverted: the ME
// Controller is infrastructure, not a trophy, and Twilight Forest is a mid-game
// dimension that should come BEFORE space, not after it.
//
// The rule now is: getting INTO a mod is mid-game, mastering it is earned.
//
//   BASIC AE2 (controller, drives, terminals, cells, buses)  ungated
//       - still gated in practice by the Inscriber, which SkyForge's datapack
//         already requires a Mekanism Advanced Control Circuit to build.
//         "The digital age requires the electric age" is a fair ask.
//
//   AUTOCRAFTING (Crafting Unit + Molecular Assembler)       Naga
//       - the single biggest power jump in AE2, so it stays earned - but the
//         FIRST Twilight boss now, not a planet.
//
//   COMPUTERS (Advanced Computer, Peripheral Casing)         Mars
//   WIRELESS  (Quantum Ring)                                 Hydra
//   ENDGAME   (Spatial IO, all MEGA cells)                   Venus
//   DRACONIC  (Draconium Core)                               Knight Phantom
//
// Paired with twilightforest-common.toml, where portalUnlockedByAdvancement was
// cleared so the Twilight Forest opens on its own merits.
//
// Resulting ladder:
//   island -> Mekanism power -> AE2 network -> Twilight -> autocrafting
//          -> Wither -> space -> computers/wireless -> Venus -> Draconic
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  const gate = (recipeId, find, replace, label) => {
    try {
      event.replaceInput({ id: recipeId }, find, replace)
      console.log(`[adventure_gates] ${label}: ${recipeId}  ${find} -> ${replace}`)
    } catch (err) {
      console.error(`[adventure_gates] FAILED ${label} (${recipeId}): ${err}`)
    }
  }

  // -------------------------------------------------------------------------
  // TIER 1 - Twilight Forest, the Naga. AUTOCRAFTING.
  //
  // The ME Controller is deliberately NOT gated - you can build a real network,
  // store everything and use terminals as soon as you have Mekanism circuits.
  // What you cannot do is make the network build things FOR you until the first
  // boss is dead. That is the difference between storage and automation, and it
  // is the right place to ask for effort.
  // -------------------------------------------------------------------------
  gate(
    'ae2:network/crafting/cpu_crafting_unit',
    '#forge:ingots/iron',
    'twilightforest:naga_scale',
    'Crafting Unit <- Naga'
  )

  gate(
    'ae2:network/crafting/molecular_assembler',
    '#forge:ingots/iron',
    'twilightforest:naga_scale',
    'Molecular Assembler <- Naga'
  )

  // -------------------------------------------------------------------------
  // TIER 2 - Mars. Computers.
  // One Ostrum per Advanced Computer: a real gate without being punishing.
  // The Peripheral Casing is the true choke point - every Advanced Peripherals
  // block is built on top of it.
  // -------------------------------------------------------------------------
  gate(
    'computercraft:computer_advanced',
    '#forge:dusts/redstone',
    'ad_astra:ostrum_ingot',
    'Advanced Computer <- Mars'
  )

  gate(
    'advancedperipherals:peripheral_casing',
    '#forge:ingots/iron',
    'ad_astra:ostrum_ingot',
    'Peripheral Casing <- Mars'
  )

  // -------------------------------------------------------------------------
  // TIER 3 - Twilight Forest, the Hydra. Wireless AE2.
  // Fiery Ingots are smelted from Fiery Blood, which only the Hydra drops.
  // -------------------------------------------------------------------------
  gate(
    'ae2:network/blocks/quantum_ring',
    '#forge:ingots/iron',
    'twilightforest:fiery_ingot',
    'Quantum Ring <- Hydra'
  )

  // -------------------------------------------------------------------------
  // TIER 4 - Venus. Endgame storage.
  // Spatial IO and the whole MEGA Cells line sit behind the hottest planet.
  // sky_steel_ingot is the base of every MEGA cell, so gating it gates them all.
  // -------------------------------------------------------------------------
  gate(
    'ae2:network/blocks/spatial_io_port',
    '#forge:ingots/iron',
    'ad_astra:calorite_ingot',
    'Spatial IO Port <- Venus'
  )

  gate(
    'megacells:transform/sky_steel_ingot',
    '#forge:ingots/iron',
    'ad_astra:calorite_ingot',
    'Sky Steel (all MEGA cells) <- Venus'
  )

  // -------------------------------------------------------------------------
  // TIER 5 - Twilight Forest, the Knight Phantom. Draconic Evolution.
  // Knightmetal comes from the Goblin Stronghold. The Draconium Core is the
  // root of the entire Draconic tree, so this gates Act IV behind real combat.
  // -------------------------------------------------------------------------
  gate(
    'draconicevolution:components/draconium_core',
    '#forge:ingots/gold',
    'twilightforest:knightmetal_ingot',
    'Draconium Core <- Knight Phantom'
  )

  console.log('[adventure_gates] adventure gating applied (rebalanced: basic AE2 ungated)')
})
