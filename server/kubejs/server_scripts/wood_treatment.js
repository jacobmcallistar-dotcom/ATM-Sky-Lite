// ATM Sky Lite - treated wood / hardened planks
// ---------------------------------------------------------------------------
// TREATED WOOD, WITHOUT A BUCKET
// -----------------------------
// IE's hand recipe is `immersiveengineering:shaped_fluid`:
//
//     www        w = #minecraft:planks
//     wbw        b = 1000 mB #forge:creosote, supplied as a BUCKET
//     www        -> 8 treated wood
//
// Two problems with it. The bucket has to be shuffled in and out of the grid
// by hand, and `shaped_fluid` is IE's own recipe type, so nothing in this pack
// can automate it - not AE2 patterns, not mechanical crafters. It is a hand
// recipe forever.
//
// So this adds a BASIN route. Fluid arrives by pipe, no bucket is ever held,
// and the whole thing runs unattended:
//
//     1 plank + 125 mB immersiveengineering:creosote  ->  1 treated wood
//
// 125 mB per plank is exactly the hand recipe's rate (1000 mB for 8), so
// automating it costs the same creosote it always did.
//
// Mixing, deliberately - not another filling recipe. Filling is the Spout, and
// piling more recipes onto plank+creosote in a Spout is what caused the
// hardened planks bug below. Mixing is a basin+mixer, so it shares its inputs
// with nothing.
//
// Treated wood can now be made three ways: the hand craft (bucket, 8 at a
// time), createaddition's Spout recipe, and this basin. All the same rate.
//
// HARDENED PLANKS - ONE ROUTE, AND IT IS A PRESS
// ----------------------------------------------
// They used to be impossible. Three create:filling recipes took planks plus
// creosote, and Create's own compat recipe took the #forge:creosote TAG at
// 125 mB - a tag that contains tfmg:creosote as well as IE's. Hardened planks
// wanted the same planks at 250 mB, so the cheaper recipe was always satisfied
// first and you got treated wood every single time.
//
// Rather than balance three fluid recipes against each other, hardened planks
// are now made by pressing treated wood, and the fluid route is gone entirely:
//
//     4x treated wood + heat  ->  1x hardened planks     [create:compacting]
//
// No fluid means nothing can shadow it, and it can never be shadowed again.
// It also keeps hardened planks strictly dearer than treated wood - four
// planks and four lots of creosote plus a heat source - so the progression
// Jacob wanted survives, and both woods are automatable, which was the
// original request.
//
// TFMG creosote keeps all its other uses; it simply no longer makes planks.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // -------------------------------------------------------------------------
  // Clear out both fluid routes to planks so there is exactly one recipe per
  // product and no possibility of one shadowing the other.
  //
  //   create:...treated_wood_in_spout   the tag-based one that caused the bug
  //   tfmg:filling/hardened_planks      replaced by the press below
  // -------------------------------------------------------------------------
  event.remove({ id: 'create:filling/compat/immersiveengineering/treated_wood_in_spout' })
  console.log('[wood] REMOVED create tag-based creosote->treated wood (it shadowed hardened planks)')

  event.remove({ id: 'tfmg:filling/hardened_planks' })
  console.log('[wood] REMOVED tfmg creosote->hardened planks (the press is the route now)')

  // -------------------------------------------------------------------------
  // Treated wood in a basin. No bucket, no crafting grid.
  // -------------------------------------------------------------------------
  event.custom({
    type: 'create:mixing',
    ingredients: [
      { tag: 'minecraft:planks' },
      { amount: 125, fluid: 'immersiveengineering:creosote', nbt: {} }
    ],
    results: [
      { item: 'immersiveengineering:treated_wood_horizontal' }
    ]
  }).id('kubejs:treated_wood_mixing')
  console.log('[wood] Basin: plank + 125 mB IE creosote -> treated wood (no bucket)')

  // -------------------------------------------------------------------------
  // Hardened planks by press. The only route.
  // -------------------------------------------------------------------------
  event.custom({
    type: 'create:compacting',
    heatRequirement: 'heated',
    ingredients: [
      { item: 'immersiveengineering:treated_wood_horizontal' },
      { item: 'immersiveengineering:treated_wood_horizontal' },
      { item: 'immersiveengineering:treated_wood_horizontal' },
      { item: 'immersiveengineering:treated_wood_horizontal' }
    ],
    results: [
      { item: 'tfmg:hardened_planks' }
    ]
  }).id('kubejs:hardened_planks_from_treated_wood')
  console.log('[wood] Compacting: 4x treated wood + heat -> hardened planks (only route)')
})
