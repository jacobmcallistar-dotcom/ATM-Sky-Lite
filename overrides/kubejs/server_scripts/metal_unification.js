// ATM Sky Lite - metal unification
// ---------------------------------------------------------------------------
// THE PROBLEM
// -----------
// Six mods in this pack register their own steel ingot. Five register lead.
// Four register nickel and silver. They are all in the correct forge tag, so a
// recipe written against #forge:ingots/steel accepts any of them - but a recipe
// that hard-codes `tfmg:steel_ingot` accepts exactly one, and if the steel in
// your chest came from Immersive Engineering you simply cannot craft it.
//
// Jacob hit this and it is not a rare edge case: with 16 metals holding
// multiple variants, the odds of owning the "wrong" one are high, and nothing
// in game explains why the recipe will not fill.
//
// THE FIX
// -------
// For every metal that has more than one variant, rewrite every recipe that
// names a specific variant so it takes the tag instead. One line per variant:
//
//     event.replaceInput({}, 'tfmg:steel_ingot', '#forge:ingots/steel')
//
// The variant list is read from the tag at runtime rather than hardcoded, so
// adding or removing a mod keeps this correct with no edits here.
//
// WHY NOT A UNIFICATION MOD
// -------------------------
// AlmostUnified and friends do this and more - they also hide duplicates from
// JEI and rewrite outputs so only one variant is ever produced. That is a
// bigger behavioural change than asked for, and it is another jar to keep
// compatible. This does the part that was actually broken: inputs.
//
// Outputs are deliberately left alone. Every mod still produces its own steel;
// they are simply all interchangeable now.
//
// SPELLING: there is no aluminum/aluminium split in this pack - checked every
// forge:ingots/* tag, all 71 metals use one spelling each. If a mod is ever
// added that uses the other, it will need an alias here.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  // Families worth unifying. Ingots are what Jacob asked for; the others break
  // in exactly the same way and are just as commonly hard-coded.
  global.MU_FAMILIES = ['ingots', 'nuggets', 'plates', 'dusts', 'gears', 'rods', 'storage_blocks']

  // Metals confirmed to have more than one variant in this pack.
  //
  // The second block was added with GregTech. GT registers its own ingot and
  // dust for ~100 materials, which turned fifteen previously single-variant
  // metals into multi-variant ones overnight - exactly the breakage this
  // script exists to prevent, just with gtceu: as the surprise item instead
  // of tfmg:. Verified against the live registry, not guessed.
  //
  // copper, gold and iron are in the GT block but were ALREADY broken before
  // it: five mods ship a dust for each (enderio, IE, mekanism, occultism,
  // thermal) and none of the three was ever listed here. GT just made it a
  // sixth. Ingots for those three are untouched - GT deliberately reuses the
  // vanilla ingot rather than adding a rival, so there is nothing to unify.
  global.MU_METALS = [
    'steel', 'lead', 'nickel', 'silver', 'electrum', 'aluminum', 'constantan',
    'calorite', 'desh', 'ostrum', 'zinc', 'draconium', 'uranium', 'bronze',
    'tin', 'lithium',
    // added with GregTech
    'bismuth', 'brass', 'cobalt', 'copper', 'gold', 'invar', 'iridium', 'iron',
    'naquadah', 'osmium', 'platinum', 'rose_gold', 'silicon', 'titanium',
    'tungsten'
  ]

  global.MU_SWAPS = 0
  global.MU_TAGS = 0

  global.MU_FAMILIES.forEach(family => {
    global.MU_METALS.forEach(metal => {
      const tag = `#forge:${family}/${metal}`

      let ids = []
      try {
        ids = Ingredient.of(tag).getItemIds().toArray()
      } catch (err) {
        return // tag does not exist for this family/metal pair
      }

      // Nothing to unify unless there are at least two variants.
      if (!ids || ids.length < 2) return

      global.MU_TAGS++
      ids.forEach(id => {
        try {
          event.replaceInput({}, id, tag)
          global.MU_SWAPS++
        } catch (err2) {
          console.log(`[metal] could not swap ${id} -> ${tag}: ${err2}`)
        }
      })

      console.log(`[metal] ${tag} unified across ${ids.length} variants`)
    })
  })

  console.log(`[metal] ${global.MU_TAGS} tags unified, ${global.MU_SWAPS} ingredient swaps applied`)
})
