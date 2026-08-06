// ATM Sky Lite - Adventure Gating
// ---------------------------------------------------------------------------
// Purpose: stop AE2 automation and computer automation from being reachable
// without ever leaving the island. Every gate below swaps ONE ingredient of an
// existing recipe for a material that can only be obtained by killing a
// Twilight Forest boss or by flying to an Ad Astra planet.
//
// The recipe SHAPE is never changed - only an ingredient is substituted - so
// JEI still shows a familiar layout and nothing else in the pack breaks.
//
// Gate ladder:
//   Naga Scale     -> Twilight Forest, Naga (first boss)
//   Fiery Ingot    -> Twilight Forest, Hydra (Fiery Blood)
//   Knightmetal    -> Twilight Forest, Knight Phantom (Goblin Stronghold)
//   Desh Ingot     -> The Moon        (Ad Astra tier 1 rocket)
//   Ostrum Ingot   -> Mars            (Ad Astra tier 2 rocket)
//   Calorite Ingot -> Venus           (Ad Astra tier 3 rocket)
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
  // TIER 1 - Twilight Forest, the Naga.
  // The ME Controller is the gate to having a network at all. You cannot run
  // AE2 beyond a trivial ad-hoc setup until the first boss is dead.
  // -------------------------------------------------------------------------
  gate(
    'ae2:network/blocks/controller',
    'ae2:smooth_sky_stone_block',
    'twilightforest:naga_scale',
    'ME Controller <- Naga'
  )

  // -------------------------------------------------------------------------
  // TIER 2 - The Moon. Autocrafting.
  // Both halves of autocrafting (the CPU and the assembler) now need Desh,
  // which only generates on the Moon. Storage and terminals still work before
  // this, so the network stays useful while you build the rocket.
  // -------------------------------------------------------------------------
  gate(
    'ae2:network/crafting/cpu_crafting_unit',
    '#forge:ingots/iron',
    'ad_astra:desh_ingot',
    'Crafting Unit <- Moon'
  )

  gate(
    'ae2:network/crafting/molecular_assembler',
    '#forge:ingots/iron',
    'ad_astra:desh_ingot',
    'Molecular Assembler <- Moon'
  )

  // -------------------------------------------------------------------------
  // TIER 3 - Mars. Computers.
  // One Ostrum per Advanced Computer: a real gate without being punishing,
  // since you craft a lot of these. The Peripheral Casing is the true choke
  // point - every Advanced Peripherals block is built on top of it.
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
  // TIER 4 - Twilight Forest, the Hydra. Wireless AE2.
  // Fiery Ingots are smelted from Fiery Blood, which only the Hydra drops.
  // -------------------------------------------------------------------------
  gate(
    'ae2:network/blocks/quantum_ring',
    '#forge:ingots/iron',
    'twilightforest:fiery_ingot',
    'Quantum Ring <- Hydra'
  )

  // -------------------------------------------------------------------------
  // TIER 5 - Venus. Endgame storage.
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
  // TIER 6 - Twilight Forest, the Knight Phantom. Draconic Evolution.
  // Knightmetal comes from the Goblin Stronghold. The Draconium Core is the
  // root of the entire Draconic tree, so this gates Act IV behind real combat.
  // -------------------------------------------------------------------------
  gate(
    'draconicevolution:components/draconium_core',
    '#forge:ingots/gold',
    'twilightforest:knightmetal_ingot',
    'Draconium Core <- Knight Phantom'
  )

  console.log('[adventure_gates] adventure gating applied')
})
