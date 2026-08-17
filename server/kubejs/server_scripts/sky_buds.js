// ATM Sky Lite - Budding planet ore, recipes
// ---------------------------------------------------------------------------
// The blocks themselves are registered in startup_scripts/sky_buds.js.
//
// A LADDER, NOT THREE SEPARATE CRAFTS
// -----------------------------------
// Each budding block is the CENTRE of the next one, so the chain has to be
// climbed in order:
//
//     Budding Amethyst + 8x Desh Block      ->  Budding Desh      (Moon)
//     Budding Desh     + 8x Ostrum Block    ->  Budding Ostrum    (Mars)
//     Budding Ostrum   + 8x Calorite Block  ->  Budding Calorite  (Venus)
//
// This maps the farm onto the same Moon -> Mars -> Venus ladder that
// tier_gates.js and endgame.js already use, so it never runs ahead of travel.
//
// THE CENTRE IS CONSUMED. Turning a Budding Desh into a Budding Ostrum spends
// it, so if you want to keep farming desh you need a second one - which costs
// another Budding Amethyst and another 8 desh blocks. That is deliberate on
// Jacob's design: a live farm on every planet is meant to be a real
// investment, not a by-product of climbing.
//
// WHERE THE BUDDING AMETHYST COMES FROM
// -------------------------------------
// Occultism does NOT provide one - checked the jar, zero references. The route
// in this pack is ARS NOUVEAU, which ships:
//
//     ars_nouveau:budding_conversion   minecraft:amethyst_block -> budding_amethyst
//
// so it is renewable and does not depend on finding a geode, which matters in
// a void world where geodes do not generate.
//
// COST: 8 metal BLOCKS is 72 ingots per rung. That is steep on purpose - these
// are infinite ore sources, and the first batch still has to be hand-mined on
// the planet before the trip stops repeating.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // centre item -> resulting budding block, in ladder order
  const LADDER = [
    { centre: 'minecraft:budding_amethyst', ring: 'ad_astra:desh_block',     out: 'kubejs:budding_desh',     label: 'Budding Desh <- Budding Amethyst + 8 Desh Blocks' },
    { centre: 'kubejs:budding_desh',        ring: 'ad_astra:ostrum_block',   out: 'kubejs:budding_ostrum',   label: 'Budding Ostrum <- Budding Desh + 8 Ostrum Blocks' },
    { centre: 'kubejs:budding_ostrum',      ring: 'ad_astra:calorite_block', out: 'kubejs:budding_calorite', label: 'Budding Calorite <- Budding Ostrum + 8 Calorite Blocks' }
  ]

  LADDER.forEach(step => {
    event.shaped(step.out, [
      'BBB',
      'BCB',
      'BBB'
    ], {
      B: step.ring,
      C: step.centre
    }).id(step.out)

    console.log(`[sky_buds] ${step.label}`)
  })

  // -------------------------------------------------------------------------
  // Cluster -> raw ore.
  //
  // The clusters drop themselves rather than raw ore, because KubeJS 2001.6.5
  // has no `drops()` on BlockBuilder and LootJS is not installed. So the
  // conversion lives here instead. One cluster is worth 2 raw ore.
  //
  // This is arguably the better shape anyway: the cluster is a real item, so a
  // filter, a pipe or an autocrafter can see it, and a harvester farm can dump
  // clusters into a chest and convert them in bulk later.
  // -------------------------------------------------------------------------
  global.SKY_BUD_METALS.forEach(m => {
    event.shapeless(Item.of(m.raw, 2), [`kubejs:${m.name}_cluster`])
      .id(`kubejs:${m.name}_cluster_to_raw`)

    console.log(`[sky_buds] ${m.nice} Cluster -> 2x ${m.raw}`)
  })
})
