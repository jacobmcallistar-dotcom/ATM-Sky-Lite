// ATM Sky Lite - treated wood / hardened planks
// ---------------------------------------------------------------------------
// THE BUG THIS FIXES
// ------------------
// Hardened Planks were unobtainable. Not hard - impossible.
//
// Three create:filling recipes take #minecraft:planks plus creosote:
//
//   create:filling/compat/immersiveengineering/treated_wood_in_spout
//       125 mB of #forge:creosote (a TAG)      -> IE treated wood
//   createaddition:filling/treated_wood_planks
//       125 mB of immersiveengineering:creosote -> IE treated wood
//   tfmg:filling/hardened_planks
//       250 mB of tfmg:creosote                 -> tfmg:hardened_planks
//
// forge:creosote contains BOTH immersiveengineering:creosote AND tfmg:creosote.
// So Create's own compat recipe matches TFMG creosote as well, at 125 mB -
// half what hardened planks costs. Put planks and TFMG creosote in a Spout and
// the 125 mB recipe is always satisfied first. You get treated wood. Every
// time. There is no way to build around it.
//
// An earlier version of this file asserted the opposite - "two different
// fluids, so a Spout can only ever match one of them". That was wrong: it
// compared TFMG's recipe against the one added here and never looked in
// Create's compat folder, where the tag-based recipe lives.
//
// FIX: drop Create's tag-based compat recipe. Treated wood is still fully
// covered by createaddition's recipe, which names immersiveengineering:creosote
// exactly, so nothing is lost - and TFMG creosote is freed to do the job it was
// always meant to do.
//
// Result, with no ambiguity left anywhere:
//     IE creosote   + plank -> treated wood      (125 mB)
//     TFMG creosote + plank -> hardened planks   (250 mB)
//
// The filling recipe this file used to add is gone too: it was byte-identical
// in effect to createaddition's, so it was pure duplication.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // -------------------------------------------------------------------------
  // Remove the recipe that made hardened planks impossible.
  // -------------------------------------------------------------------------
  event.remove({ id: 'create:filling/compat/immersiveengineering/treated_wood_in_spout' })
  console.log('[wood] REMOVED create tag-based creosote->treated wood (it shadowed hardened planks)')

  // -------------------------------------------------------------------------
  // AN ALTERNATIVE ROUTE TO HARDENED PLANKS
  //
  // Jacob asked for a second way in, because the only route ran through TFMG
  // creosote, and TFMG creosote comes from the coking chain:
  //
  //     tfmg:coking  1 coal            -> coal coke + 1 mB creosote
  //     tfmg:coking  #logs_that_burn   -> charcoal  + 2 mB creosote
  //
  // 2 mB per log against 250 mB per plank is 125 logs a plank. That is not a
  // gate, it is a wall - and the coal version is one he does not want to use.
  //
  // So: compact treated wood into hardened planks. Heated basin, 4 in 1 out.
  //
  //     4x treated wood + heat -> 1x hardened planks
  //
  // Chosen as COMPACTING rather than another filling recipe on purpose. Adding
  // a fourth planks+creosote filling recipe is exactly the mistake that caused
  // this bug. Compacting shares no inputs with any of them, so it cannot
  // shadow or be shadowed.
  //
  // It keeps hardened planks strictly more expensive than treated wood - four
  // planks and four lots of creosote, plus a heat source - so the progression
  // Jacob wanted is intact. It is also fully automatable, which was the
  // original request for both woods.
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
  console.log('[wood] Compacting: 4x treated wood + heat -> hardened planks (coal-free route)')

  console.log('[wood] IE creosote -> treated wood, TFMG creosote -> hardened planks, no overlap')
})
