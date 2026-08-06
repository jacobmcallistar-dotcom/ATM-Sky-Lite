// ATM Sky Lite - Celestial Core
// ---------------------------------------------------------------------------
// The new centre of the win condition.
//
// Heart of the Sky already demanded seven boss kills, but every one of them
// came from BOMD, Cataclysm or the Wither - nothing from the Twilight Forest,
// nothing from the planets. The Core fixes that: it is the single item that
// forces you to clear the Twilight boss ladder AND stand on all three worlds
// before the pack will let you finish.
// ---------------------------------------------------------------------------

StartupEvents.registry('item', event => {
  event.create('celestial_core')
    .displayName('Celestial Core')
    .rarity('epic')
    .glow(true)
    .maxStackSize(1)
    .tooltip('§7Five trophies. Three worlds. One ending.')
    .tooltip('§8Forged where the Twilight meets the void.')
})
