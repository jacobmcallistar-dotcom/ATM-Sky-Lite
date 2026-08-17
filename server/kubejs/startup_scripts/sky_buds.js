// ATM Sky Lite - Budding planet ore
// ---------------------------------------------------------------------------
// Ad Astra's three metals only exist as worldgen ore on their own planet, so
// every time the pack asks for Desh, Ostrum or Calorite the answer is another
// mining trip. Nothing in the pack renews them - Mystical Agriculture has no
// planet-metal seeds installed, despite what the Essence Farming chapter says.
//
// This adds an amethyst-style budding block per metal:
//
//     budding_desh      grows  desh_bud     -> desh_cluster       Moon only
//     budding_ostrum    grows  ostrum_bud   -> ostrum_cluster     Mars only
//     budding_calorite  grows  calorite_bud -> calorite_cluster   Venus only
//
// WHY EACH ONE IS LOCKED TO ITS OWN PLANET
// ----------------------------------------
// Desh/Ostrum/Calorite are the pack's TRAVEL GATES - tier_gates.js hangs the
// Mekanism circuit ladder off them (Elite <- Moon, Ultimate <- Mars) and
// endgame.js puts all three in the Celestial Core. If one greenhouse at home
// could farm all three, that entire ladder collapses into "wait".
//
// Locking each block to its own dimension keeps the ladder intact: you still
// fly there, and you still build and power a base on the surface. What it
// removes is the RE-mining, which is the tedious part rather than the gate.
//
// The check is exact - `ad_astra:moon`, not `ad_astra:moon_orbit` - so a space
// station in orbit does not count as being on the planet.
//
// GROWS UPWARD ONLY
// -----------------
// Vanilla budding amethyst grows on all six faces, which needs a directional
// cluster block to look right. These grow into the air block directly above
// instead: one face, no facing state, and the farm is obvious to build - a
// floor of budding blocks with one empty layer above.
//
// DROPS ARE A RECIPE, NOT A LOOT TABLE
// ------------------------------------
// KubeJS 2001.6.5's BlockBuilder has no `drops()` method and exposes `lootTable`
// only as a raw field, and LootJS is not installed - so the clusters drop
// THEMSELVES and server_scripts/sky_buds.js converts a cluster into raw ore in
// a crafting grid. That is also friendlier to automation: the cluster is a real
// item a filter or autocrafter can see.
//
// TEXTURES ARE AD ASTRA'S OWN
// ---------------------------
// textureAll points at ad_astra's existing textures rather than new art, so
// these read as native Ad Astra blocks: `encased_*_block` for the budding block
// (framed, clearly not just an ore) and `raw_*_block` for the crystals.
//
// API NOTES - all verified with javap against the installed KubeJS jar, after
// three of them turned out to be wrong on the first attempt:
//   - `randomTick` takes ONE argument, a RandomTickCallbackJS, with `.block`
//     and `.random` fields. It is NOT (block, random).
//   - `soundType` wants a SoundType object; the string form is the convenience
//     method `stoneSoundType()`.
//   - `drops` and `light` do not exist. `lightLevel(float 0-1)` does.
//
// CLIENTS MUST HAVE THIS FILE. Registering blocks changes the registry, so any
// player whose kubejs folder is missing sky_buds.js is kicked on join.
// ---------------------------------------------------------------------------

// name -> the dimension it may grow in, and what a cluster is worth
global.SKY_BUD_METALS = [
  { name: 'desh',     dim: 'ad_astra:moon',  raw: 'ad_astra:raw_desh',     nice: 'Desh'     },
  { name: 'ostrum',   dim: 'ad_astra:mars',  raw: 'ad_astra:raw_ostrum',   nice: 'Ostrum'   },
  { name: 'calorite', dim: 'ad_astra:venus', raw: 'ad_astra:raw_calorite', nice: 'Calorite' }
]

StartupEvents.registry('block', event => {

  global.SKY_BUD_METALS.forEach(m => {

    // -----------------------------------------------------------------------
    // The budding block. On each random tick it has a 1-in-4 chance of
    // advancing whatever sits directly above it by one stage.
    // -----------------------------------------------------------------------
    event.create(`budding_${m.name}`)
      .displayName(`Budding ${m.nice}`)
      .textureAll(`ad_astra:block/encased_${m.name}_block`)
      .hardness(4.0)
      .resistance(6.0)
      .requiresTool(true)
      .tagBlock('minecraft:mineable/pickaxe')
      .tagBlock('forge:needs_iron_tool')
      .stoneSoundType()
      .randomTick(ctx => {
        const block = ctx.block

        // the whole gate: wrong planet, nothing happens, ever
        if (String(block.dimension) !== m.dim) return
        if (ctx.random.nextInt(4) !== 0) return

        const up = block.up
        const id = up.id

        if (id === 'minecraft:air') {
          up.set(`kubejs:${m.name}_bud`)
        } else if (id === `kubejs:${m.name}_bud`) {
          up.set(`kubejs:${m.name}_cluster`)
        }
      })

    // -----------------------------------------------------------------------
    // Stage 1. Drops itself, so breaking one by accident costs nothing and a
    // half-grown farm can be picked up and moved.
    // -----------------------------------------------------------------------
    event.create(`${m.name}_bud`)
      .displayName(`${m.nice} Bud`)
      .textureAll(`ad_astra:block/raw_${m.name}_block`)
      .box(5, 0, 5, 11, 7, 11)
      .fullBlock(false)
      .notSolid()
      .renderType('cutout')
      .hardness(1.0)
      .requiresTool(true)
      .tagBlock('minecraft:mineable/pickaxe')
      .stoneSoundType()
      .lightLevel(0.2)

    // -----------------------------------------------------------------------
    // Stage 2 - the harvestable one. Worth 2 raw ore, via the recipe in
    // server_scripts/sky_buds.js.
    // -----------------------------------------------------------------------
    event.create(`${m.name}_cluster`)
      .displayName(`${m.nice} Cluster`)
      .textureAll(`ad_astra:block/raw_${m.name}_block`)
      .box(3, 0, 3, 13, 13, 13)
      .fullBlock(false)
      .notSolid()
      .renderType('cutout')
      .hardness(1.5)
      .requiresTool(true)
      .tagBlock('minecraft:mineable/pickaxe')
      .stoneSoundType()
      .lightLevel(0.35)
  })
})
