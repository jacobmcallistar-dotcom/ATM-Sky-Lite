// ATM Sky Lite - GregTech late game leaves the crafting grid
// ---------------------------------------------------------------------------
// WHAT JACOB ASKED FOR
// --------------------
// "GregTech will be the late game crafting that will eventually be automated -
//  I want the late game crafts to be harder and not crafted with generic
//  crafting."
//
// GregTech mostly agrees already: machine parts are Assembler recipes and
// circuits are Circuit Assembler recipes. But it also ships crafting-table
// fallbacks for a lot of them, so a player with a full inventory can bypass
// the entire factory and hand-build an EV motor on a bench. This closes that.
//
// THE RULE
// --------
// For every GregTech machine hull, casing, component and circuit at MV and
// above, remove the crafting-table recipe - but ONLY if a machine recipe for
// the same item already exists.
//
// That condition is the whole safety mechanism. It is checked at runtime
// against the actual recipe set rather than assumed, so if GregTech ever drops
// an assembler recipe, or another mod's compat removes one, the bench recipe
// survives instead of the item becoming uncraftable. A soft-lock here would be
// invisible until someone hit it forty hours in.
//
// WHY MV AND ABOVE
// ----------------
// Steam and LV are where a player learns the mod. Taking the bench away before
// they have an Assembler running would be a wall, not a difficulty curve - and
// the Assembler itself is an LV machine, so it must stay hand-craftable or
// nothing works at all.
//
// This pairs with two config flags turned on in gtceu.yaml for the same
// reason: harderCircuitRecipes (first circuit of each set yields 1, not 2) and
// hardMultiRecipes (nerfed multiblock controller recipes).
// ---------------------------------------------------------------------------

ServerEvents.recipes(event => {

  const BENCH = ['minecraft:crafting_shaped', 'minecraft:crafting_shapeless']

  // Tiers whose parts must come off a machine. LV and below stay on the bench.
  const TIERS = ['mv', 'hv', 'ev', 'iv', 'luv', 'zpm', 'uv']

  // Item-name suffixes that count as "machine infrastructure" rather than a
  // finished machine - these are the pieces the Assembler is meant to make.
  const PARTS = [
    'machine_hull', 'machine_casing', 'electric_motor', 'electric_pump',
    'electric_piston', 'conveyor_module', 'robot_arm', 'emitter', 'sensor',
    'field_generator', 'voltage_coil', 'hermetic_casing'
  ]

  // Circuits above the LV set. Named explicitly - the circuit line does not
  // follow the voltage-prefix naming the machine parts do.
  const CIRCUITS = [
    'good_electronic_circuit', 'basic_integrated_circuit',
    'good_integrated_circuit', 'advanced_integrated_circuit',
    'micro_processor', 'micro_processor_assembly', 'micro_processor_computer',
    'micro_processor_mainframe', 'nano_processor', 'nano_processor_assembly',
    'nano_processor_computer', 'nano_processor_mainframe',
    'quantum_processor', 'quantum_processor_assembly',
    'quantum_processor_computer', 'quantum_processor_mainframe',
    'crystal_processor', 'crystal_processor_assembly',
    'crystal_processor_computer', 'crystal_processor_mainframe',
    'wetware_processor', 'wetware_processor_assembly',
    'wetware_processor_computer'
  ]

  // ---- build the target list --------------------------------------------
  let targets = []
  TIERS.forEach(t => PARTS.forEach(p => targets.push(`gtceu:${t}_${p}`)))
  CIRCUITS.forEach(c => targets.push(`gtceu:${c}`))

  let removed = 0
  let kept = 0
  let absent = 0

  targets.forEach(id => {
    let stack
    try {
      stack = Item.of(id)
      if (stack.isEmpty()) { absent++; return }
    } catch (err) {
      absent++            // item does not exist in this GregTech build
      return
    }

    // Does a NON-bench recipe for this item exist? Only then may we remove.
    // Counted first, removed second - `event.remove` by filter is the stable
    // KubeJS API here, whereas calling .remove() on an iterated recipe object
    // is not guaranteed to exist on this version.
    let machineCount = 0
    let benchCount = 0
    try {
      event.forEachRecipe({ output: id }, r => {
        const type = '' + r.getType()
        if (BENCH.indexOf(type) !== -1) benchCount++
        else machineCount++
      })
    } catch (err) {
      console.log(`[gt-hard] could not inspect recipes for ${id}: ${err}`)
      return
    }

    if (benchCount === 0) return

    if (machineCount === 0) {
      // No machine route - removing the bench recipe would strand the item.
      kept++
      console.log(`[gt-hard] KEPT ${id} - bench recipe is its only route`)
      return
    }

    BENCH.forEach(type => event.remove({ output: id, type: type }))
    removed += benchCount
  })

  console.log(`[gt-hard] ${removed} bench recipes removed, ${kept} kept (no machine route), ${absent} items absent`)
})
