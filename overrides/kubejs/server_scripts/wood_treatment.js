// ATM Sky Lite - treated wood automation
// ---------------------------------------------------------------------------
// Treated Wood Planks and TFMG's Hardened Planks are the same idea - soak a
// plank in creosote - but only one of them could ever be automated:
//
//   immersiveengineering:treated_wood_horizontal
//       type  immersiveengineering:shaped_fluid
//       cost  8 planks + 1000 mB #forge:creosote  ->  8      (125 mB/plank)
//       CRAFTING TABLE ONLY. `shaped_fluid` is IE's own recipe type, so no
//       autocrafter in the pack touches it - not AE2 patterns, not Create
//       mechanical crafters. It is a hand recipe forever.
//
//   tfmg:hardened_planks
//       type  create:filling
//       cost  1 plank + 250 mB tfmg:creosote  ->  1
//       Spout. Fully automatable already.
//
// This adds the missing half: a filling recipe for treated wood, so a Spout
// can make it too.
//
// WHY THIS CANNOT LEAK INTO HARDENED PLANKS
// -----------------------------------------
// Hardened Planks demands `tfmg:creosote` as an EXACT fluid, not a tag. The
// recipe below demands `immersiveengineering:creosote`, also exact. Two
// different fluids, so a Spout can only ever match one of them and Create is
// never asked to pick between two recipes.
//
// That keeps the existing hard lock intact: hardened planks still requires
// TFMG creosote specifically, which means TFMG's coking chain, and IE creosote
// from a Coke Oven cannot buy your way past it. (The reverse is already true
// and harmless - IE's crafting recipe takes the `#forge:creosote` tag, so TFMG
// creosote can make treated wood. Spending the better fluid on the cheaper
// item costs nobody anything.)
//
// NO SELF-LOOP: treated wood is not in `minecraft:planks` - IE only puts
// fiberboard in that tag - so a spout line cannot feed its own output back in.
//
// Balance is untouched. 125 mB per plank is exactly the hand recipe's rate
// (1000 mB for 8), so automating it costs the same creosote it always did.
// The crafting recipe is left in place for early game.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  event.custom({
    type: 'create:filling',
    ingredients: [
      { tag: 'minecraft:planks' },
      { amount: 125, fluid: 'immersiveengineering:creosote', nbt: {} }
    ],
    results: [
      { item: 'immersiveengineering:treated_wood_horizontal' }
    ]
  }).id('kubejs:treated_wood_filling')

  console.log('[wood] Spout: plank + 125 mB IE creosote -> treated wood planks')
})
