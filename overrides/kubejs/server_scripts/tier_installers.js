// ATM Sky Lite - Tier Installers become the only way to upgrade a machine
// ---------------------------------------------------------------------------
// THE PROBLEM
//
// Mekanism ships TWO ways to reach a higher machine tier:
//
//   1. Right-click the placed block with a Tier Installer
//   2. Craft the upgrade - the lower machine is just an ingredient in the
//      higher one's recipe  ("ACA / IPI / ACA", P = the machine below it)
//
// Because (2) exists, (1) is pointless - nobody ever crafts a Tier Installer.
// Worse, it means machine tiers can be autocrafted straight to Ultimate with
// no interaction at all, which is most of why Mekanism runs away with the pack.
//
// Removing (2) makes the installer the real upgrade path: craft a Basic
// machine, place it, and upgrade it in the world.
//
// WHAT IS *NOT* REMOVED, AND WHY
// ------------------------------
// A scan of every recipe in all 184 jars for tiered Mekanism blocks used as
// INGREDIENTS turned up three families that other recipes depend on:
//
//   advanced/elite/ultimate ENERGY CUBE
//       -> induction/cell/*  AND  induction/provider/*
//          Deleting these makes the INDUCTION MATRIX uncraftable.
//   advanced/elite INDUCTION CELL and PROVIDER
//       -> the next tier of themselves, and
//   ultimate_induction_provider
//       -> module_gravitational_modulating_unit  (MekaSuit flight)
//
// Those stay craftable. So do all transmitters (cable, pipe, tube,
// transporter, conductor) - you need those in bulk and by the hundred, and
// hand-upgrading a cable run would be miserable rather than interesting.
//
// NET EFFECT
//   36 recipes removed - factories, bins, fluid tanks, chemical tanks
//   Everything else untouched. Nothing becomes unobtainable.
//
// Already-built machines are unaffected. This only changes how the NEXT one
// is made.
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  let removed = 0
  const drop = (id, label) => {
    try {
      event.remove({ id: id })
      removed++
    } catch (err) {
      console.error(`[tier_installers] FAILED ${label} (${id}): ${err}`)
    }
  }

  const TIERS = ['advanced', 'elite', 'ultimate']

  // --- Factories: the nine ore/material processing machines ----------------
  // factory/basic/* is KEPT - that is how a plain machine becomes a factory
  // in the first place, and it is the bottom of the ladder.
  const FACTORY_TYPES = [
    'smelting', 'enriching', 'crushing', 'compressing', 'combining',
    'purifying', 'injecting', 'infusing', 'sawing'
  ]
  TIERS.forEach(tier => {
    FACTORY_TYPES.forEach(type => {
      drop(`mekanism:factory/${tier}/${type}`, `factory ${tier} ${type}`)
    })
  })

  // --- Bins ----------------------------------------------------------------
  TIERS.forEach(tier => {
    drop(`mekanism:bin/${tier}`, `bin ${tier}`)
  })

  // --- TANKS ARE NOT TOUCHED -----------------------------------------------
  // Fluid and Chemical Tanks stay fully craftable at every tier. They are
  // used as ingredients elsewhere and are wanted as ordinary storage, so
  // forcing them through a Tier Installer would be a nuisance rather than
  // progression. Do not "tidy" these back in.

  console.log(`[tier_installers] removed ${removed} tier-up crafts - machines must now be upgraded with a Tier Installer`)
  console.log('[tier_installers] KEPT: energy cubes + induction cells/providers (Induction Matrix + MekaSuit flight depend on them), and all transmitters')
})
