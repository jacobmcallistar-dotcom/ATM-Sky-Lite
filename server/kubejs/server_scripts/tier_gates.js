// ATM Sky Lite - Tier Gating for Mekanism
// ---------------------------------------------------------------------------
// Mekanism is fine to START early and becomes extremely strong very quickly,
// because once you are in, nothing stops you climbing the whole tier ladder on
// your island. This maps that ladder onto the SAME travel ladder as everything
// else: Moon -> Mars -> Venus. No combat, no new mechanics.
//
// This file also gated Powah until 2026-08-16; see the note at the bottom.
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
//   Digital Miner          already needs Atomic Alloy, so it inherits that
//                          gate - plus an explicit Desh cost below.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // Calorite (Venus) was the third rung here, spent on Powah's Nitro Crystal.
  // With Powah gone nothing in this file reaches Venus, so the constant went
  // with it rather than sitting unused.
  const DESH   = 'ad_astra:desh_ingot'    // Moon
  const OSTRUM = 'ad_astra:ostrum_ingot'  // Mars

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
  // POWAH - REMOVED 2026-08-16
  //
  // This file used to gate Powah's crystal ladder (Niotic <- Moon, Spirited <-
  // Mars, Nitro <- Venus) through `powah:energizing` recipes. Powah was
  // removed from the pack, so those gates went with it - a recipe gate on a
  // mod that is not installed is dead code at best, and `event.custom` against
  // a missing recipe type throws at load at worst.
  //
  // Powah was the pack's passive-power answer; nothing replaced it directly.
  // Its endgame role lives on in the Seal of Flux, which moved to Immersive
  // Engineering's HV Capacitor (see sky_seals.js).
  // =========================================================================

  console.log('[tier_gates] Mekanism tier ladder mapped onto Moon -> Mars -> Venus')
})
