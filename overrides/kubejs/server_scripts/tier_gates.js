// ATM Sky Lite - Tier Gating for Mekanism and Powah
// ---------------------------------------------------------------------------
// Both mods are fine to START early and become extremely strong very quickly,
// because once you are in, nothing stops you climbing the whole tier ladder on
// your island. This maps those ladders onto the SAME travel ladder as
// everything else: Moon -> Mars -> Venus. No combat, no new mechanics.
//
// Existing builds are unaffected - a recipe gate only changes what you can
// craft NEXT. Anything already placed keeps working forever.
//
// WHY THE CONTROL CIRCUITS AND NOT THE ALLOYS
// -------------------------------------------
// The obvious lever looked like Reinforced/Atomic Alloy. It does not work:
// those are `mekanism:metallurgic_infusing` recipes, which take exactly ONE
// item slot plus a chemical, so there is nowhere to put a travel material
// without deleting the alloy step itself.
//
// The Control Circuits are plain shaped recipes, and every Elite/Ultimate
// machine in Mekanism needs one, so gating them gates the tier just as
// effectively - and visibly, in a normal crafting grid.
//
// ALREADY GATED, NO CHANGE NEEDED
// -------------------------------
//   MekaSuit + Meka-Tool   need Polonium, which needs a fission reactor,
//                          whose casing SkyForge already gates behind the
//                          Hydra's Fiery Ingot. So the suit is late-game
//                          combat-gated already.
//   Nitro Crystal          already costs a Nether Star (the Wither).
//   Digital Miner          already needs Atomic Alloy, so it inherits that
//                          gate - plus an explicit Desh cost below.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  const DESH     = 'ad_astra:desh_ingot'      // Moon
  const OSTRUM   = 'ad_astra:ostrum_ingot'    // Mars
  const CALORITE = 'ad_astra:calorite_ingot'  // Venus

  // =========================================================================
  // MEKANISM - the Control Circuit ladder
  //
  // Basic and Advanced stay ungated: that is ordinary mid-game Mekanism and
  // the mod is no fun without it. Elite and Ultimate are where the 4x/5x ore
  // processing and the fast machines live, so those cost a trip.
  //
  // The alloy is KEPT in each recipe and the travel material is ADDED beneath
  // it, so the tier progression still reads correctly in JEI.
  // =========================================================================

  // Elite Control Circuit <- the Moon
  event.remove({ id: 'mekanism:control_circuit/elite' })
  event.shaped('mekanism:elite_control_circuit', [
    'ACA',
    ' D '
  ], {
    A: '#mekanism:alloys/reinforced',
    C: '#forge:circuits/advanced',
    D: DESH
  }).id('kubejs:control_circuit_elite')
  console.log('[tier_gates] Elite Control Circuit <- Moon (Desh)')

  // Ultimate Control Circuit <- Mars
  event.remove({ id: 'mekanism:control_circuit/ultimate' })
  event.shaped('mekanism:ultimate_control_circuit', [
    'ACA',
    ' O '
  ], {
    A: '#mekanism:alloys/atomic',
    C: '#forge:circuits/elite',
    O: OSTRUM
  }).id('kubejs:control_circuit_ultimate')
  console.log('[tier_gates] Ultimate Control Circuit <- Mars (Ostrum)')

  // Digital Miner <- the Moon.
  // The single strongest automation item in the pack: it strip-mines whole
  // chunks by filter, in any dimension. Jacob asked specifically for this one.
  // Its two Basic Circuits become Desh - it already needed Atomic Alloy, so
  // this is an explicit reminder of the gate rather than a new wall.
  try {
    event.replaceInput({ id: 'mekanism:digital_miner' }, '#forge:circuits/basic', DESH)
    console.log('[tier_gates] Digital Miner <- Moon (Desh)')
  } catch (err) {
    console.error(`[tier_gates] FAILED Digital Miner: ${err}`)
  }

  // =========================================================================
  // POWAH - the crystal ladder
  //
  // Powah's whole progression is one crystal per tier out of the Energizing
  // Orb. These are `powah:energizing` recipes, which take a free-form list of
  // ingredients - so the travel material is simply appended and the original
  // input is kept.
  //
  // Energy costs are left exactly as Powah shipped them.
  // =========================================================================

  const energizing = (id, ingredients, energy, result, count, label) => {
    event.remove({ id: id })
    const json = {
      type: 'powah:energizing',
      ingredients: ingredients.map(i => ({ item: i })),
      energy: energy,
      result: count > 1 ? { item: result, count: count } : { item: result }
    }
    event.custom(json).id('kubejs:' + id.split('/').pop())
    console.log(`[tier_gates] ${label}`)
  }

  // Niotic Crystal <- the Moon
  energizing('powah:energizing/niotic_crystal',
    ['minecraft:diamond', DESH],
    300000, 'powah:crystal_niotic', 1,
    'Niotic Crystal <- Moon (Desh)')

  // Spirited Crystal <- Mars
  energizing('powah:energizing/spirited_crystal',
    ['minecraft:emerald', OSTRUM],
    1000000, 'powah:crystal_spirited', 1,
    'Spirited Crystal <- Mars (Ostrum)')

  // Nitro Crystal <- Venus. Already cost a Nether Star; Calorite is added so
  // the top tier of the best passive power in the pack sits at the end of the
  // travel ladder rather than immediately after the Wither.
  energizing('powah:energizing/nitro_crystal',
    ['minecraft:nether_star', 'minecraft:redstone_block', 'minecraft:redstone_block',
     'powah:blazing_crystal_block', CALORITE],
    20000000, 'powah:crystal_nitro', 16,
    'Nitro Crystal <- Venus (Calorite)')

  console.log('[tier_gates] Mekanism + Powah tier ladders mapped onto Moon -> Mars -> Venus')
})
