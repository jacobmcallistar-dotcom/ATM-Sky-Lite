// ATM Sky Lite - GregTech resource bridge
// ---------------------------------------------------------------------------
// THE PROBLEM
// -----------
// GregTech gets every one of its materials from ore veins in world generation.
// This pack is a void skyblock: there is no world to generate them in. Install
// GregTech as-is and you get 8,816 items, a full tech tree, and no way to reach
// any of it - the mod is inert.
//
// Ex Deorum is how this pack turns nothing into ore, but it ships sieve drops
// for vanilla and a handful of mods only. It has never heard of chalcopyrite.
//
// THE FIX
// -------
// Sieve drops for GregTech's raw ores, tiered so that ore access tracks the
// voltage tier that needs it. GregTech is meant to start after AE2 and
// PneumaticCraft, so nothing here is reachable from an Act I sieve: every
// recipe needs a diamond or netherite mesh AND a crushed block, which means
// a hammer chain and (for the last two) the Nether and the End.
//
//     crushed_deepslate  + diamond   -> steam / LV ores
//     crushed_blackstone + diamond   -> LV / MV ores
//     crushed_netherrack + netherite -> MV / HV ores
//     crushed_end_stone  + netherite -> EV / IV / LuV ores
//
// Probabilities fall as the tier rises, so late ores stay expensive without
// ever being impossible.
//
// WHY RAW ORE AND NOT THE INGOT
// -----------------------------
// Handing out ingots would skip GregTech's entire reason for existing. Raw ore
// is the input to the macerator/washer/centrifuge chain, so the byproducts,
// the doubling, and the tier-by-tier processing upgrades all still matter.
// The sieve replaces the ore vein, nothing else.
//
// RUBBER
// ------
// GregTech's cables need rubber and rubber comes from rubber trees, which are
// worldgen too. The sapling is a sieve drop for the same reason the ores are.
//
// EVERY ITEM ID BELOW WAS VALIDATED against a registry dump from this server
// with GregTech installed - not read off a wiki. gtceu:raw_iridium does not
// exist (iridium is a cooperite byproduct) and is deliberately absent.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // [siftable, mesh, [[raw ore, chance], ...]]
  const GT_SIEVE = [
    ['exdeorum:crushed_deepslate', 'exdeorum:diamond_mesh', [
      ['gtceu:raw_chalcopyrite', 0.16],   // copper
      ['gtceu:raw_cassiterite',  0.16],   // tin
      ['gtceu:raw_magnetite',    0.14],   // iron
      ['gtceu:raw_galena',       0.12],   // lead + silver
      ['gtceu:raw_sphalerite',   0.12],   // zinc
      ['gtceu:raw_pyrite',       0.10],   // iron + sulfur
      ['gtceu:rubber_sapling',   0.05]    // cables need rubber; trees are worldgen
    ]],
    ['exdeorum:crushed_blackstone', 'exdeorum:diamond_mesh', [
      ['gtceu:raw_bauxite',      0.12],   // aluminium
      ['gtceu:raw_tetrahedrite', 0.10],   // copper + antimony
      ['gtceu:raw_malachite',    0.10],   // copper
      ['gtceu:raw_apatite',      0.10],   // phosphate
      ['gtceu:raw_graphite',     0.08],   // carbon
      ['gtceu:raw_cinnabar',     0.06]    // mercury
    ]],
    ['exdeorum:crushed_netherrack', 'exdeorum:netherite_mesh', [
      ['gtceu:raw_garnierite',   0.09],   // nickel
      ['gtceu:raw_pentlandite',  0.09],   // nickel
      ['gtceu:raw_cobaltite',    0.08],   // cobalt
      ['gtceu:raw_ilmenite',     0.07],   // titanium
      ['gtceu:raw_scheelite',    0.06],   // tungsten
      ['gtceu:raw_chromite',     0.06],   // chrome
      ['gtceu:raw_molybdenite',  0.05]    // molybdenum
    ]],
    ['exdeorum:crushed_end_stone', 'exdeorum:netherite_mesh', [
      ['gtceu:raw_cooperite',    0.05],   // platinum + iridium byproduct
      ['gtceu:raw_palladium',    0.05],
      ['gtceu:raw_monazite',     0.04],   // rare earth
      ['gtceu:raw_bastnasite',   0.04],   // rare earth
      ['gtceu:raw_pitchblende',  0.03],   // uranium
      ['gtceu:raw_uraninite',    0.03],   // uranium
      ['gtceu:raw_thorium',      0.02],
      ['gtceu:raw_naquadah',     0.01]    // LuV - deliberately punishing
    ]]
  ]

  let added = 0
  GT_SIEVE.forEach(entry => {
    const siftable = entry[0]
    const mesh = entry[1]
    entry[2].forEach(drop => {
      event.custom({
        type: 'exdeorum:sieve',
        ingredient: { item: siftable },
        mesh: mesh,
        result: drop[0],
        result_amount: { type: 'minecraft:binomial', n: 1.0, p: drop[1] }
      })
      added++
    })
  })

  console.log(`[gt-bridge] ${added} GregTech sieve drops registered`)
})
