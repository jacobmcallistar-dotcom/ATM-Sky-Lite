// ATM Sky Lite - plate ownership
// ---------------------------------------------------------------------------
// THE PROBLEM
// -----------
// Jacob pressed an ingot in a Mechanical Press and got an Immersive Engineering
// plate out. Not a bug, and not the unification script (that one only rewrites
// INPUTS - see metal_unification.js). It is Create's own compat data.
//
// Create ships conditional pressing recipes that fire when IE is installed and
// deliberately output `immersiveengineering:plate_*` so the pack does not end up
// with two rival plate items per metal. Create Addition ships the same idea.
// TFMG and Powergrid did NOT get that memo and ship their own sheet recipes for
// the same ingots.
//
// The result is several `create:pressing` recipes sharing one input:
//
//     forge:ingots/aluminum -> immersiveengineering:plate_aluminum   (create)
//     forge:ingots/aluminum -> immersiveengineering:plate_aluminum   (createaddition)
//     forge:ingots/aluminum -> tfmg:aluminum_sheet                   (tfmg)
//
// Create picks the first match it finds. Which one that is depends on datapack
// load order, so the press looks like it is producing plates at random. That is
// the "getting mixed up" Jacob described.
//
// THE FIX
// -------
// One owner per metal for the press. Where a Create-family sheet exists, that is
// the winner and every rival pressing recipe for the same metal is removed. IE
// plates are still perfectly obtainable - from IE's own Metal Press, which is
// where they belong.
//
// WHAT THIS DOES NOT FIX
// ----------------------
// steel, silver, uranium and constantan have NO Create-family sheet item. Nobody
// in the Create ecosystem registers one. The press keeps producing the IE plate
// for those four because the alternative is producing nothing at all, which
// would gate steel plates behind IE's Metal Press + mold. If that gate is
// actually wanted, add those metals to STRICT below.
//
// SAFE BECAUSE
// ------------
// Every sheet named here is already in the matching `#forge:plates/<metal>` tag
// (verified against every jar in the pack), and metal_unification.js rewrites
// hardcoded plate inputs to those tags. So a recipe wanting an aluminium plate
// happily takes tfmg:aluminum_sheet.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // metal -> the item the Mechanical Press is allowed to produce.
  // Everything else in #forge:plates/<metal> loses its pressing recipe.
  const PRESS_OWNER = {
    // Create's own sheets - listed so the intent survives a mod update that
    // starts shipping a rival recipe. Currently these are already clean.
    iron:     'create:iron_sheet',
    gold:     'create:golden_sheet',
    copper:   'create:copper_sheet',
    brass:    'create:brass_sheet',

    // Create-family addons that do register a sheet.
    electrum: 'createaddition:electrum_sheet',
    zinc:     'createaddition:zinc_sheet',
    aluminum: 'tfmg:aluminum_sheet',
    lead:     'tfmg:lead_sheet',
    nickel:   'tfmg:nickel_sheet',

    // Steel has no Create-family sheet, but it was still ambiguous: the press
    // could produce EITHER ad_astra:steel_plate OR immersiveengineering:plate_steel
    // from the same ingot. IE wins because IE plate_steel is what the pack's
    // machinery actually consumes, and because ad_astra's own recipes accept it -
    // the `ad_astra:steel_plates` tag includes `#forge:plates/steel`.
    //
    // Side effect: ad_astra:steel_plate had exactly one recipe in the pack (that
    // pressing recipe) so the item is now uncraftable. Nothing needs it
    // specifically - everything reads the tag. Flip this to
    // 'ad_astra:steel_plate' if that item should be the survivor instead.
    steel:    'immersiveengineering:plate_steel'
  }

  // Metals to strip from the press entirely, forcing IE's Metal Press instead.
  // Empty by default - see WHAT THIS DOES NOT FIX above. To gate steel behind
  // IE, put 'steel' in here.
  const STRICT = []

  let removed = 0
  let added = 0

  Object.keys(PRESS_OWNER).forEach(metal => {
    const keep = PRESS_OWNER[metal]
    const tag = `#forge:plates/${metal}`

    let variants = []
    try {
      variants = Ingredient.of(tag).getItemIds().toArray()
    } catch (err) {
      console.log(`[plates] ${tag} does not exist, skipping ${metal}`)
      return
    }

    // Drop every pressing recipe that makes a rival plate for this metal.
    variants.forEach(id => {
      if (String(id) === keep) return
      try {
        event.remove({ type: 'create:pressing', output: id })
        removed++
      } catch (err) {
        console.log(`[plates] could not remove pressing -> ${id}: ${err}`)
      }
    })

    // Make sure something still presses this metal. If the owning mod ever drops
    // its recipe we would otherwise silently delete the whole chain.
    let survivors = 0
    event.forEachRecipe({ type: 'create:pressing', output: keep }, () => { survivors++ })

    if (survivors === 0) {
      event.recipes.create.pressing(keep, `#forge:ingots/${metal}`)
      added++
      console.log(`[plates] ${metal}: no surviving recipe, re-added press -> ${keep}`)
    }
  })

  // Optional hard separation: no press recipe at all, IE Metal Press only.
  STRICT.forEach(metal => {
    const tag = `#forge:plates/${metal}`
    let variants = []
    try {
      variants = Ingredient.of(tag).getItemIds().toArray()
    } catch (err) {
      return
    }
    variants.forEach(id => {
      try {
        event.remove({ type: 'create:pressing', output: id })
        removed++
      } catch (err) { /* nothing to remove */ }
    })
    console.log(`[plates] ${metal}: pressing removed entirely, IE Metal Press only`)
  })

  console.log(`[plates] ${removed} rival pressing recipes removed, ${added} re-added`)
})
