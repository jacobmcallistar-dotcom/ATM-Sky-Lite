// ATM Sky Lite - Ad Astra fuel economy
// ---------------------------------------------------------------------------
// THE PROBLEM
// -----------
// Ad Astra's Fuel Refinery is `ad_astra:refining`: 5 mB of `#ad_astra:oil` ->
// 5 mB of `ad_astra:fuel`, at 30 FE/t. That is a 1:1 conversion and the machine
// costs almost nothing to run - so fuel was never the bottleneck. OIL was.
//
// The only oil source in the pack was SkyForge's `skyforge:oil_synthesis`:
//
//     8 coal blocks + 1 bucket  =  1 oil bucket      (72 coal per 1000 mB)
//
// That is a plain crafting recipe, so it works, but it is 72 coal per bucket
// and a rocket wants three. Worse, it is the ONLY route, so the whole space
// program throttles on hand-feeding coal blocks into a crafting grid.
//
// THE LEVER
// ---------
// `ad_astra:oil` is a fluid TAG, and Ad Astra ships it already pointing at
// other mods' oil:
//
//     ad_astra:oil = [ ad_astra:oil, #c:oil, #forge:oil,
//                      techreborn:oil, #forge:crude_oil, #c:crude_oil ]
//
// TFMG registers `tfmg:crude_oil` into `forge:crude_oil`. So ANY source of
// crude oil feeds the Fuel Refinery for free, with no new refining recipe -
// and simultaneously feeds TFMG's distillation tower and Create: Diesel
// Generators, which crack crude into diesel / gasoline / kerosene / LPG.
//
// One recipe therefore opens three mods at once instead of one.
//
// WHAT THIS SCRIPT ADDS
// ---------------------
//   1. Coal cracking, in a Create basin. Automatable, 4x cheaper than the
//      hand recipe, and the output is crude oil rather than Ad Astra oil so
//      the TFMG/CDG chains light up too.
//   2. IE biodiesel counts as oil. The Squeezer -> Fermenter -> Refinery chain
//      is fully automatable and farm-fed, so late game the space program runs
//      on hemp instead of coal. No coal cost at all.
//
// SkyForge's 8-coal-block hand recipe is deliberately LEFT IN PLACE as the
// no-tech fallback - it is what gets you your first rocket before you have a
// basin, and it stays autocraftable in AE2.
// ---------------------------------------------------------------------------

ServerEvents.tags('fluid', event => {

  // -------------------------------------------------------------------------
  // IE biodiesel is oil.
  //
  // The chain, all of it automatable and all of it renewable:
  //     Garden Cloche  -> hemp                     (no farmland, no player)
  //     Squeezer       -> 120 mB plantoil / seed
  //     Fermenter      -> 80 mB ethanol / sugar cane
  //     Refinery       -> 8 plantoil + 8 ethanol + saltpeter = 16 biodiesel
  //
  // Biodiesel out equals inputs in, so the Refinery is not a loss - the whole
  // cost is the farm and the four multiblocks, which is exactly the kind of
  // build this pack wants to reward. Ad Astra then takes it 1:1 to fuel.
  //
  // This does NOT take biodiesel away from IE's own Diesel Generator; a fluid
  // can sit in as many tags as it likes.
  // -------------------------------------------------------------------------
  event.add('ad_astra:oil', 'immersiveengineering:biodiesel')
  console.log('[fuel] immersiveengineering:biodiesel added to #ad_astra:oil')
})

ServerEvents.recipes(event => {

  // -------------------------------------------------------------------------
  // Coal cracking - Create mixing, heated basin.
  //
  //     1 coal block + 1000 mB water  ->  500 mB tfmg:crude_oil
  //
  // 18 coal per bucket of crude, against 72 for the hand recipe: 4x cheaper,
  // and it runs unattended off a coal farm and a blaze burner.
  //
  // Output is `tfmg:crude_oil`, NOT `ad_astra:oil`, on purpose. Crude is in
  // `forge:crude_oil`, which `ad_astra:oil` already accepts, so it refines to
  // rocket fuel exactly as before - but it ALSO feeds TFMG's Distillation
  // Tower and CDG's distillation, which is where diesel and kerosene come
  // from. Emitting ad_astra:oil here would have been a dead end.
  //
  // Water is in the recipe because it is what makes this steam cracking rather
  // than alchemy, and because plumbing water to the basin is a build step
  // rather than a free lunch. It costs nothing but the pipe.
  //
  // "heated" = an ordinary blaze burner. Superheated (blaze cake) was
  // considered and rejected: the point of this script is to unblock the space
  // program, not to add a second gate in front of it.
  // -------------------------------------------------------------------------
  event.custom({
    type: 'create:mixing',
    heatRequirement: 'heated',
    ingredients: [
      { item: 'minecraft:coal_block' },
      { amount: 1000, fluid: 'minecraft:water', nbt: {} }
    ],
    results: [
      { amount: 500, fluid: 'tfmg:crude_oil' }
    ]
  }).id('kubejs:crude_oil_from_coal')
  console.log('[fuel] Create mixing: coal block + water -> 500 mB tfmg:crude_oil (heated)')

  console.log('[fuel] Ad Astra oil supply: coal cracking + IE biodiesel')
})
