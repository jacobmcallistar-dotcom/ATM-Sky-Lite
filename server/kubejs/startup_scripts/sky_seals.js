// ATM Sky Lite - The Nine Sky Seals
// ---------------------------------------------------------------------------
// The win condition used to be 18 grid slots of boss drops and three planet
// ingots. Every one of them was something you PICKED UP - the only thing you
// had to manufacture was two Antimatter Pellets. You could finish the pack
// with a chest and a crafting table, which made automation decorative.
//
// Nine Seals fix that. Each one is 8x a mod's deepest craftable item plus a
// keystone, so a seal is 100-200 sub-crafts once expanded. All nine are
// required, so nine separate production lines have to actually work.
//
// The chain:
//     9 Seals            -> Sky Matrix
//     Sky Matrix + Celestial Core -> Ascension Core
//     Ascension Core     -> the centre of the Heart of the Sky
//
// The Celestial Core is untouched, so the boss ladder and the three planets
// are still required exactly as before. The Seals are added on top, not
// instead.
// ---------------------------------------------------------------------------

StartupEvents.registry('item', event => {

  const seal = (id, name, lore) => {
    event.create(id)
      .displayName(name)
      .rarity('epic')
      .glow(true)
      .maxStackSize(1)
      .tooltip(lore)
      .tooltip('§8One of nine. All nine are required.')
  }

  seal('seal_circuits',  'Seal of Circuits',   '§7Mekanism · ultimate circuitry')
  seal('seal_network',   'Seal of the Network','§7Applied Energistics · every processor')
  seal('seal_rotation',  'Seal of Rotation',   '§7Create · precision, eight times over')
  seal('seal_flux',      'Seal of Flux',       '§7Immersive Engineering · high-voltage storage')
  seal('seal_dragon',    'Seal of the Dragon', '§7Draconic Evolution · awakened metal')
  seal('seal_growth',    'Seal of Growth',     '§7Mystical Agriculture · supreme essence')
  seal('seal_swarm',     'Seal of the Swarm',  '§7Productive Bees · an apiary that works')
  seal('seal_ender',     'Seal of Ender',      '§7Ender IO · vibrant crystal')
  seal('seal_dimension', 'Seal of Dimensions', '§7RFTools · dimensional shards')

  event.create('sky_matrix')
    .displayName('Sky Matrix')
    .rarity('epic')
    .glow(true)
    .maxStackSize(1)
    .tooltip('§7Nine seals, nine industries, one lattice.')
    .tooltip('§8Proof that every system in the pack is running.')

  event.create('ascension_core')
    .displayName('Ascension Core')
    .rarity('epic')
    .glow(true)
    .maxStackSize(1)
    .tooltip('§7The Celestial Core, wound through the Sky Matrix.')
    .tooltip('§8Conquest and industry, in one hand.')
})
