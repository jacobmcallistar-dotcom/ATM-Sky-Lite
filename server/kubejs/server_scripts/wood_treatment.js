// ATM Sky Lite - treated wood / hardened planks
// ---------------------------------------------------------------------------
// ANY CREOSOTE MAKES TREATED WOOD
// -------------------------------
// There are two creosotes in this pack and #forge:creosote holds both:
//
//     immersiveengineering:creosote            IE Coke Oven
//     tfmg:creosote / tfmg:flowing_creosote    TFMG coking
//
// IE's hand recipe has always taken the TAG, so both work by hand. The
// automatable routes did not - and for a while neither did, because of a fix
// that overshot.
//
// WHAT WENT WRONG, AND WHY IT IS SAFE NOW
// ---------------------------------------
// Hardened planks used to be a create:filling recipe: plank + 250 mB
// tfmg:creosote. Create ships its own compat recipe taking plank +125 mB of
// the #forge:creosote TAG for treated wood - and since that tag contains TFMG
// creosote, the cheaper 125 mB recipe always matched first. Hardened planks
// were unobtainable.
//
// That was fixed by deleting Create's tag recipe. It worked, but it took the
// only automatable route that accepted TFMG creosote with it, so a Create-side
// coking setup could no longer make treated wood in a Spout at all.
//
// Hardened planks are now a PRESS with no fluid in the recipe (below), so
// nothing on plank+creosote can shadow them any more. The tag recipe is
// therefore safe to keep, and every route below takes #forge:creosote:
//
//     hand craft   8 planks + 1000 mB  -> 8    (IE shaped_fluid, not automatable)
//     Spout        1 plank  +  125 mB  -> 1    (Create's compat recipe)
//     basin        1 plank  +  125 mB  -> 1    (added here, no bucket)
//
// All three at the same rate. createaddition ships a fourth that duplicates the
// Spout one but only accepts IE creosote; it is removed so there is exactly one
// recipe per machine and no ambiguity for Create to resolve.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // -------------------------------------------------------------------------
  // Remove the redundant IE-only Spout recipe. Create's own compat recipe does
  // the same job at the same rate and accepts BOTH creosotes, so keeping both
  // would leave two recipes matching identical inputs.
  // -------------------------------------------------------------------------
  event.remove({ id: 'createaddition:filling/treated_wood_planks' })
  console.log('[wood] REMOVED createaddition IE-only spout recipe (create compat covers both creosotes)')

  // -------------------------------------------------------------------------
  // Hardened planks: the fluid route stays gone. The press is the only way.
  // -------------------------------------------------------------------------
  event.remove({ id: 'tfmg:filling/hardened_planks' })
  console.log('[wood] REMOVED tfmg creosote->hardened planks (the press is the route)')

  // -------------------------------------------------------------------------
  // Treated wood in a basin - no bucket, fluid arrives by pipe.
  //
  // fluidTag, not fluid: this is the whole point of this revision. Naming
  // immersiveengineering:creosote exactly is what locked TFMG creosote out.
  // 125 mB per plank matches the hand recipe's rate (1000 mB for 8).
  // -------------------------------------------------------------------------
  event.custom({
    type: 'create:mixing',
    ingredients: [
      { tag: 'minecraft:planks' },
      { amount: 125, fluidTag: 'forge:creosote' }
    ],
    results: [
      { item: 'immersiveengineering:treated_wood_horizontal' }
    ]
  }).id('kubejs:treated_wood_mixing')
  console.log('[wood] Basin: plank + 125 mB #forge:creosote -> treated wood (either creosote)')

  // -------------------------------------------------------------------------
  // Hardened planks by press. No fluid, so nothing can shadow it, and it can
  // never shadow anything else. Four treated wood keeps it strictly dearer.
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
