// ATM Sky Lite - Progression Gating  (v3 - travel is mid-game, combat is late-game)
// ---------------------------------------------------------------------------
// THE DESIGN RULE
//
//   MID-GAME  = learning the mods. Gated by TRAVEL. No boss kills, ever.
//   LATE-GAME = finishing the game. Gated by COMBAT and hard crafts.
//
// Everything below follows from that one line. If a gate requires killing
// something, it belongs to the late game and must not sit in front of a mod you
// are still learning.
//
// WHAT WAS WRONG BEFORE
// ---------------------
// Every travel destination in the pack was locked behind the space program,
// and the space program was locked behind the Wither:
//
//   Twilight Forest  <- ad_astra:moon advancement   (mod since removed)
//   The Undergarden  <- Ostrum   (Mars)
//   Blue Skies       <- Calorite (Venus)
//   Ad Astra itself  <- Nether Star on the NASA Workbench (kill the Wither)
//
// Four exploration dimensions, all behind one boss. So there was no mid-game
// travel of any kind - after you got power there was nowhere to GO until very
// late, and AE2 sat on the far side of all of it.
//
// THE NEW TRAVEL LADDER
// ---------------------
//   Moon    (Desh)     -> AE2 network + the Undergarden
//   Mars    (Ostrum)   -> AE2 autocrafting, computers, Blue Skies
//   Venus   (Calorite) -> Spatial IO, MEGA cells
//
// All three are reached by building a rocket and flying. Nothing has to die.
//
// THE WITHER IS NOT GONE. The Nether Star has been removed from the NASA
// Workbench (see nasa_workbench below), but it is still required for the
// HEART OF THE SKY - the win condition itself. So the Wither remains a
// mandatory kill; it just no longer blocks the mid-game.
//
// Combat now gates only late-game power:
//   Sun Spirit     -> wireless AE2
//   Valkyrie Queen -> Draconic Evolution
//   Wither         -> Heart of the Sky (via SkyForge's recipe)
//
// TWILIGHT FOREST -> THE AETHER  (2026-08-11)
// -------------------------------------------
// Twilight Forest was removed from the pack. The Aether replaces it as the
// adventure dimension, and the two combat gates below moved onto Aether bosses.
//
// The mapping rule is now uniform and worth stating once: EVERY combat gate in
// this pack is a DUNGEON KEY, dropped by the boss that guards that dungeon.
// Keys are a guaranteed single drop per kill - they cannot be sieved, traded,
// bred or duplicated - and because Aether dungeons keep generating across the
// dimension, a player who needs another one can go and earn another one. That
// is the same "kill it again" cost the old trophies had, with none of TF's
// mixture of ingots, trophies and stronghold loot.
//
//   Bronze Dungeon / Slider          -> aether:bronze_dungeon_key
//   Silver Dungeon / Valkyrie Queen  -> aether:silver_dungeon_key
//   Gold Dungeon   / Sun Spirit      -> aether:gold_dungeon_key
//   Brass Dungeon  / Eye of the Storm-> deep_aether:brass_dungeon_key
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  const gate = (recipeId, find, replace, label) => {
    try {
      event.replaceInput({ id: recipeId }, find, replace)
      console.log(`[gates] ${label}: ${recipeId}  ${find} -> ${replace}`)
    } catch (err) {
      console.error(`[gates] FAILED ${label} (${recipeId}): ${err}`)
    }
  }

  // =========================================================================
  // MID-GAME - TRAVEL ONLY. No boss kills below this line.
  // =========================================================================

  // --- The Moon (Desh) -----------------------------------------------------
  // The ME Controller is the gate to having a real network. It costs a trip to
  // the Moon: build a rocket, fly, mine Desh, come home. That is a genuine
  // project without a single point where you can lose your gear to a boss.
  gate(
    'ae2:network/blocks/controller',
    'ae2:smooth_sky_stone_block',
    'ad_astra:desh_ingot',
    'ME Controller <- Moon'
  )

  // The Undergarden moves from Mars to the Moon, so it becomes a mid-game
  // destination instead of late-game content nobody ever reaches.
  gate(
    'undergarden:catalyst',
    'ad_astra:ostrum_ingot',
    'ad_astra:desh_ingot',
    'Undergarden Catalyst <- Moon (was Mars)'
  )

  // --- Mars (Ostrum) -------------------------------------------------------
  // Autocrafting is the biggest single power jump in AE2, so it is one planet
  // further out than the network itself. Still just travel.
  gate(
    'ae2:network/crafting/cpu_crafting_unit',
    '#forge:ingots/iron',
    'ad_astra:ostrum_ingot',
    'Crafting Unit <- Mars'
  )

  gate(
    'ae2:network/crafting/molecular_assembler',
    '#forge:ingots/iron',
    'ad_astra:ostrum_ingot',
    'Molecular Assembler <- Mars'
  )

  gate(
    'computercraft:computer_advanced',
    '#forge:dusts/redstone',
    'ad_astra:ostrum_ingot',
    'Advanced Computer <- Mars'
  )

  gate(
    'advancedperipherals:peripheral_casing',
    '#forge:ingots/iron',
    'ad_astra:ostrum_ingot',
    'Peripheral Casing <- Mars'
  )

  // Blue Skies moves from Venus to Mars - late-mid exploration rather than a
  // dimension gated behind the hottest planet in the pack.
  gate(
    'blue_skies:zeal_lighter',
    'ad_astra:calorite_ingot',
    'ad_astra:ostrum_ingot',
    'Blue Skies Zeal Lighter <- Mars (was Venus)'
  )

  // --- Venus (Calorite) ----------------------------------------------------
  // The outermost travel gate. Endgame storage, but still no combat.
  gate(
    'ae2:network/blocks/spatial_io_port',
    '#forge:ingots/iron',
    'ad_astra:calorite_ingot',
    'Spatial IO Port <- Venus'
  )

  gate(
    'megacells:transform/sky_steel_ingot',
    '#forge:ingots/iron',
    'ad_astra:calorite_ingot',
    'Sky Steel (all MEGA cells) <- Venus'
  )

  // =========================================================================
  // LATE-GAME - COMBAT. Finishing the game, not learning it.
  // =========================================================================

  // The Gold Key drops only from the Sun Spirit, the Aether's final boss, at
  // the bottom of a Gold Dungeon. This is the old Hydra slot: the hardest fight
  // in the adventure dimension guards wireless AE2.
  gate(
    'ae2:network/blocks/quantum_ring',
    '#forge:ingots/iron',
    'aether:gold_dungeon_key',
    'Quantum Ring <- Sun Spirit'
  )

  // The Silver Key drops from the Valkyrie Queen, who will not even fight you
  // until you have collected Victory Medals from her Valkyries - so this gate
  // is a dungeon crawl, not a single ambush. The Draconium Core is the root of
  // the entire Draconic tree. This is the old Knight Phantom slot.
  gate(
    'draconicevolution:components/draconium_core',
    '#forge:ingots/gold',
    'aether:silver_dungeon_key',
    'Draconium Core <- Valkyrie Queen'
  )

  // --- The fission gate ----------------------------------------------------
  // SkyForge's own datapack ships
  //   data/mekanismgenerators/recipes/fission_reactor/casing.json
  // which overrode the Mekanism casing recipe to demand a Twilight Forest
  // Fiery Ingot. That item no longer exists, so as of the Aether swap that
  // recipe fails to load and the casing became UNCRAFTABLE - which would have
  // dead-ended Age VI silently. This restores it on the Aether ladder.
  //
  // Two deliberate changes from the SkyForge original:
  //   - Fiery Ingot -> Gold Dungeon Key, so fission stays a COMBAT gate (the
  //     Sun Spirit) rather than quietly becoming a mining gate.
  //   - output 4 -> 16, because a key is one guaranteed drop per boss kill
  //     whereas Fiery Ingots came in batches. At 4 per craft a reactor would
  //     have cost several Gold Dungeons; at 16 a single Sun Spirit covers it.
  event.remove({ id: 'mekanismgenerators:fission_reactor/casing' })
  event.shaped('16x mekanismgenerators:fission_reactor_casing', [
    ' I ',
    'IXI',
    ' F '
  ], {
    I: '#forge:ingots/lead',
    F: 'aether:gold_dungeon_key',
    X: 'mekanism:steel_casing'
  }).id('mekanismgenerators:fission_reactor/casing')
  console.log('[gates] fission casing re-gated: twilightforest:fiery_ingot -> aether:gold_dungeon_key (x16)')

  // =========================================================================
  // NASA WORKBENCH - the Nether Star STAYS.  (Jacob's call, stated twice.)
  //
  // SkyForge's datapack puts a Nether Star on the workbench, so the Wither must
  // die before any planet is reachable. I briefly removed it and put it back on
  // request: the Wither is wanted as the gate to the Moon.
  //
  // The consequence, recorded here so it is not a surprise later: because AE2
  // now hangs off Desh, the ME Controller sits behind exactly ONE boss kill.
  // The chain is
  //
  //     power -> Wither -> NASA Workbench -> rocket -> Moon -> Desh -> AE2
  //
  // That is a single, well-signposted fight rather than the old stack of three
  // compounding gates, and the Wither is a summonable boss you can prepare for
  // on your own island - no dimension crawl, no gear loss on the way in.
  //
  // Everything BEYOND the Moon is still pure travel: Mars for autocrafting and
  // computers, Venus for MEGA and Spatial IO. Only wireless AE2 and Draconic
  // ask for more killing.
  // =========================================================================

  console.log('[gates] v4 applied - Wither gates the Moon; Aether bosses gate late-game power')
})
