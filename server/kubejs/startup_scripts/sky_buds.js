// ATM Sky Lite - Budding planet ore
// ---------------------------------------------------------------------------
// Ad Astra's three metals only exist as worldgen ore on their own planet, so
// every time the pack asks for Desh, Ostrum or Calorite the answer is another
// mining trip. Nothing in the pack renews them - Mystical Agriculture has no
// planet-metal seeds installed, despite what the Essence Farming chapter says.
//
// This adds an amethyst-style budding block per metal:
//
//     budding_desh      grows  desh_bud     -> desh_cluster       Moon ORBIT
//     budding_ostrum    grows  ostrum_bud   -> ostrum_cluster     Mars ORBIT
//     budding_calorite  grows  calorite_bud -> calorite_cluster   Venus ORBIT
//
// THEY ONLY GROW IN SPACE - THAT IS THE POINT
// -------------------------------------------
// Jacob's brief: "currently there is almost no use for a space station". So the
// growth check is the ORBIT dimension, not the planet surface. Standing on the
// Moon does nothing; the farm has to live on a station in Moon orbit. Each
// metal wants its own station, which is three real builds and finally gives Ad
// Astra's space stations a job.
//
// Progression is not gated by this - it is gated by the RECIPE ladder in
// server_scripts/sky_buds.js. Budding Ostrum costs 8 ostrum blocks (72 ingots),
// which you can only have if you already went to Mars and mined it. So the
// travel gates that tier_gates.js and endgame.js hang off Desh/Ostrum/Calorite
// stay exactly as strong as they were.
//
// The check is exact - `ad_astra:moon_orbit`, not `ad_astra:moon` - so the
// surface deliberately does not count.
//
// KEEPING THE FARM RUNNING: random ticks need the chunk loaded AND ticking.
// FTB Chunks is installed - claim the station chunks and force-load them, and
// they keep ticking while you are online anywhere, so the farm runs while you
// are back home on the island.
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

// name -> the ORBIT it may grow in, and what a cluster is worth
global.SKY_BUD_METALS = [
  { name: 'desh',     dim: 'ad_astra:moon_orbit',  raw: 'ad_astra:raw_desh',     nice: 'Desh',     where: 'Moon orbit'  },
  { name: 'ostrum',   dim: 'ad_astra:mars_orbit',  raw: 'ad_astra:raw_ostrum',   nice: 'Ostrum',   where: 'Mars orbit'  },
  { name: 'calorite', dim: 'ad_astra:venus_orbit', raw: 'ad_astra:raw_calorite', nice: 'Calorite', where: 'Venus orbit' }
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

        // the whole gate: not in the right ORBIT, nothing happens, ever.
        // The planet surface below deliberately does not count.
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
