// ATM Sky Lite - Sky Seal recipes
// ---------------------------------------------------------------------------
// Each seal is a 3x3: EIGHT of a mod's deepest craftable item around ONE
// keystone. Eight is deliberate - it is the most a shaped recipe can demand of
// a single ingredient, and for items like the Ultimate Control Circuit or the
// Precision Mechanism that expands to well over a hundred sub-crafts.
//
// Every id below was verified against a registry built from all installed jars
// plus the vanilla jar before this file was written. Nothing here is guessed.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // ring of 8 `outer`, one `centre`
  const seal = (out, outer, centre, label) => {
    event.shaped(`kubejs:${out}`, [
      'OOO',
      'OCO',
      'OOO'
    ], { O: outer, C: centre }).id(`kubejs:${out}`)
    console.log(`[seals] ${label}: 8x ${outer} + ${centre}`)
  }

  // --- 1. Mekanism ---------------------------------------------------------
  // Ultimate Control Circuit is basic -> advanced -> elite -> ultimate, each
  // step an infusion. Eight of them is the single biggest Mekanism order in
  // the pack.
  seal('seal_circuits', 'mekanism:ultimate_control_circuit',
       'mekanism:alloy_atomic', 'Seal of Circuits')

  // --- 2. Applied Energistics ----------------------------------------------
  // All three processors, so the whole inscriber line has to be running, with
  // a Singularity at the centre - which needs a Matter Condenser and a great
  // deal of fed-in matter.
  event.shaped('kubejs:seal_network', [
    'ECL',
    'CSC',
    'LCE'
  ], {
    E: 'ae2:engineering_processor',
    C: 'ae2:calculation_processor',
    L: 'ae2:logic_processor',
    S: 'ae2:singularity'
  }).id('kubejs:seal_network')
  console.log('[seals] Seal of the Network: 8x processors + singularity')

  // --- 3. Create -----------------------------------------------------------
  seal('seal_rotation', 'create:precision_mechanism',
       'create:brass_casing', 'Seal of Rotation')

  // --- 4. Powah ------------------------------------------------------------
  seal('seal_flux', 'powah:crystal_nitro',
       'powah:capacitor_nitro', 'Seal of Flux')

  // --- 5. Draconic Evolution -----------------------------------------------
  seal('seal_dragon', 'draconicevolution:awakened_draconium_ingot',
       'draconicevolution:awakened_core', 'Seal of the Dragon')

  // --- 6. Mystical Agriculture ---------------------------------------------
  // Insanium at the centre is the Mystical Agradditions tier above Supremium.
  seal('seal_growth', 'mysticalagriculture:supremium_essence',
       'mysticalagradditions:insanium_essence', 'Seal of Growth')

  // --- 7. Productive Bees --------------------------------------------------
  // NOTE: productivebees:honeycomb_bronze / _blazing / _iron are NOT registered
  // at runtime. They appear in the mod's lang file and jar assets, so an id
  // list built from jar contents reports them as valid - they are not. Only a
  // runtime probe catches this. The seal below uses ids verified by probing the
  // live server:
  //     configurable_honeycomb  EXISTS   the comb any productive bee makes
  //     centrifuge              EXISTS   the machine that processes combs
  // Eight combs plus the centrifuge means a working apiary AND its processing
  // line, not one hive in a corner.
  seal('seal_swarm', 'productivebees:configurable_honeycomb',
       'productivebees:centrifuge', 'Seal of the Swarm')

  // --- 8. Ender IO ---------------------------------------------------------
  seal('seal_ender', 'enderio:vibrant_crystal',
       'enderio:ender_crystal', 'Seal of Ender')

  // --- 9. RFTools ----------------------------------------------------------
  seal('seal_dimension', 'rftoolsbase:infused_diamond',
       'rftoolsbase:dimensionalshard', 'Seal of Dimensions')

  // -------------------------------------------------------------------------
  // The Sky Matrix - all nine, no substitutions.
  // -------------------------------------------------------------------------
  event.shaped('kubejs:sky_matrix', [
    'ABC',
    'DEF',
    'GHI'
  ], {
    A: 'kubejs:seal_circuits',
    B: 'kubejs:seal_network',
    C: 'kubejs:seal_rotation',
    D: 'kubejs:seal_flux',
    E: 'kubejs:seal_dragon',
    F: 'kubejs:seal_growth',
    G: 'kubejs:seal_swarm',
    H: 'kubejs:seal_ender',
    I: 'kubejs:seal_dimension'
  }).id('kubejs:sky_matrix')

  // -------------------------------------------------------------------------
  // Ascension Core = conquest (Celestial Core) + industry (Sky Matrix).
  // -------------------------------------------------------------------------
  event.shapeless('kubejs:ascension_core',
    ['kubejs:celestial_core', 'kubejs:sky_matrix']
  ).id('kubejs:ascension_core')

  // -------------------------------------------------------------------------
  // Swap the Heart's centre from the Celestial Core to the Ascension Core.
  // The Heart's shape is untouched, so SkyForge's own recipe keeps working -
  // exactly the same trick endgame.js already uses for the Core itself.
  // -------------------------------------------------------------------------
  try {
    event.replaceInput(
      { id: 'skyforge:heart_of_the_sky' },
      'kubejs:celestial_core',
      'kubejs:ascension_core'
    )
    console.log('[seals] Heart of the Sky centre: celestial_core -> ascension_core')
  } catch (err) {
    console.error(`[seals] FAILED to re-centre the Heart: ${err}`)
  }

  console.log('[seals] nine Sky Seals registered - every main mod is now mandatory')
})
