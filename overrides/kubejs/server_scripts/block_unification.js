// ATM Sky Lite - compressed block unification
// ---------------------------------------------------------------------------
// THE PROBLEM
// -----------
// Cyclic and Ex Deorum both add a compressed cobblestone, and both are made
// from nine cobblestone in a grid:
//
//     cyclic:compressed_cobblestone     crafting_shapeless, 9 loose cobble
//     exdeorum:compressed_cobblestone   crafting_shaped, a 3x3 of cobble
//
// Same inputs, so only one of them can ever be the result. The shaped recipe
// wins, which means you can only make Ex Deorum's.
//
// That would be harmless, except the Cyclic Harvester asks for:
//
//     "g": { "tag": "forge:storage_blocks/cobblestone" }
//
// and Cyclic is the only mod that puts anything in that tag - its own block.
// So the Harvester wants the one compressed cobblestone you cannot craft.
//
// THE FIX
// -------
// Ex Deorum already ships a tag that unifies all four known variants:
//
//     exdeorum:compressed/cobblestone
//         cyclic:compressed_cobblestone
//         exdeorum:compressed_cobblestone
//         allthecompressed:cobblestone_1x   (optional)
//         compressium:cobblestone_1         (optional)
//
// Folding that into forge:storage_blocks/cobblestone means the Harvester - and
// anything else written against the forge tag - accepts whichever compressed
// cobblestone you actually have.
//
// A tag addition, not a recipe edit: no recipe is removed, both mods keep their
// own block, and nothing is shadowed. This is the same approach as
// metal_unification.js, applied to blocks instead of ingots.
// ---------------------------------------------------------------------------

ServerEvents.tags('item', event => {

  // exdeorum:compressed/<x>  ->  forge:storage_blocks/<x>
  // Only pairs where both tags are meaningful; wrapped so a missing tag is
  // skipped rather than throwing.
  global.BU_PAIRS = [
    ['cobblestone', 'cobblestone'],
    ['cobbled_deepslate', 'cobbled_deepslate'],
    ['diorite', 'diorite'],
    ['granite', 'granite'],
    ['andesite', 'andesite'],
    ['dirt', 'dirt'],
    ['gravel', 'gravel'],
    ['sand', 'sand'],
    ['red_sand', 'red_sand'],
    ['dust', 'dust']
  ]

  global.BU_DONE = 0

  // NO Ingredient.of() GUARD HERE. This runs while tags are still being built,
  // so Ingredient.of() on a tag resolves to nothing and every add would be
  // skipped - which is exactly what happened on the first attempt: "0
  // compressed families folded". Add the reference unconditionally; a source
  // tag that does not exist simply contributes no members.
  global.BU_PAIRS.forEach(pair => {
    const src = `#exdeorum:compressed/${pair[0]}`
    const dst = `forge:storage_blocks/${pair[1]}`
    try {
      event.add(dst, src)
      global.BU_DONE++
      console.log(`[blocks] ${dst} += ${src}`)
    } catch (err) {
      console.log(`[blocks] could not fold ${src} into ${dst}: ${err}`)
    }
  })

  console.log(`[blocks] ${global.BU_DONE} compressed families folded into forge:storage_blocks/*`)
})
