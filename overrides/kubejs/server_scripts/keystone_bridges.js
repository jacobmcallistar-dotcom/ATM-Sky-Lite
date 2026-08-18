// priority: 0
//
// FIX: the four SkyForge "keystone bridge" recipes were all shapeless with the
// IDENTICAL ingredient set - 1 industrial_keystone + 2 sky_dust:
//
//     skyforge:ae2_bridge_certus        -> ae2:certus_quartz_crystal  x4
//     skyforge:mekanism_bridge_fluorite -> mekanism:fluorite_gem      x4
//     skyforge:mekanism_bridge_osmium   -> mekanism:ingot_osmium      x2
//     skyforge:powah_bridge_uraninite   -> powah:uraninite            x4
//
// Minecraft resolves a shapeless match by returning the FIRST recipe that
// matches, so only one of the four was ever obtainable and the other three
// were dead. These are the skyblock entry points into AE2, Mekanism fission
// and Powah, so three whole mod progressions were gated behind a coin flip.
//
// Each one is now SHAPED with a distinct arrangement. Cost is unchanged -
// still exactly 1 keystone + 2 sky dust, same output counts.
//
// POWAH REMOVED (2026-08-16)
// --------------------------
// The uraninite bridge is gone with the mod. Uraninite had no consumer in the
// pack outside Powah's reactors, so bridging it would have handed out an item
// with nothing to spend it on. The SkyForge datapack recipe it removed is
// deleted at source too, so there is nothing left to collide with.

ServerEvents.recipes(event => {
  const K = 'skyforge:industrial_keystone'
  const D = 'skyforge:sky_dust'

  const bridges = [
    { id: 'skyforge:mekanism_bridge_osmium',   out: 'mekanism:ingot_osmium',       n: 2, pattern: ['DKD']       },
    { id: 'skyforge:ae2_bridge_certus',        out: 'ae2:certus_quartz_crystal',   n: 4, pattern: ['D', 'K', 'D'] },
    { id: 'skyforge:mekanism_bridge_fluorite', out: 'mekanism:fluorite_gem',       n: 4, pattern: ['DD', 'K '] }
  ]

  bridges.forEach(b => {
    // drop the colliding shapeless original
    event.remove({ id: b.id })

    // re-add it shaped, under a kubejs id so it cannot clash with the removal
    const newId = 'kubejs:' + b.id.split(':')[1]
    event.shaped(Item.of(b.out, b.n), b.pattern, { D: D, K: K }).id(newId)

    console.log(`[keystone_bridges] ${b.id} -> ${newId}  ${b.pattern.join(' / ')}  => ${b.n}x ${b.out}`)
  })
})
