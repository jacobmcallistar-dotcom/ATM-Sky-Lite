# ATM Sky Lite

A Minecraft **1.20.1 Forge** void-skyblock modpack (191 mods) built around Mekanism +
Applied Energistics 2 + skyblock progression, plus a custom glue mod, **SkyForge**.

> **Minecraft: Java Edition (a genuine, paid account) is required.** The server runs
> with `online-mode=true`.

## What's in this repo

| Path | What it is |
|---|---|
| `manifest.json` | CurseForge modpack manifest (mod list by project/file ID) |
| `overrides/config/` | Client-side pack configs |
| `server/` | Dedicated-server scripts + server configs (incl. SkyblockBuilder island templates) |
| `skyforge/` | Source for the custom **SkyForge** Forge mod |
| `PACK-README.md` | Original project notes |

**The mod `.jar` files are not committed to git.** Download them from the
[**Releases**](../../releases) page (`ATM-Sky-Lite-client.zip`).

> ⚠️ `manifest.json` is **not** currently importable — all 17 of its entries still carry
> `"fileID": "LATEST"` placeholders, and it lists only a fraction of the 191 mods. The client
> zip on the Releases page is the only supported install path.

## Install (to play)

1. Install **Forge 1.20.1 – 47.3.0** from <https://files.minecraftforge.net/> ("Install client").
2. Launch the Minecraft launcher once, pick the new Forge profile, then close it.
3. Download `ATM-Sky-Lite-client.zip` from Releases and copy its `mods` and `config`
   folders into your `.minecraft` (`%appdata%\.minecraft`), merging/replacing.
   - Your `mods` folder must contain **exactly** these 191 mods — remove any extras or you'll be kicked on join.

> **Unreleased — The Twilight Forest is gone. The Aether replaces it. 191 mods.**
>
> Twilight Forest was removed and the Aether installed in its place as the pack's adventure
> dimension — `aether`, `aether-redux`, `ancient_aether`, `deep_aether`, `lost_aether_content`
> and `AetherVillages`, plus the `aeroblender` and `TerraBlender` libraries they depend on.
>
> **Every combat gate is now a dungeon key.** A key is a single *guaranteed* drop from the boss
> that guards its dungeon — it cannot be sieved, traded, bred or duplicated, and because Aether
> dungeons keep generating, another key always costs another fight. That replaces Twilight's
> mixture of ingots, trophies and stronghold loot with one uniform rule.
>
> | Gate | Was (Twilight) | Now (Aether) |
> |---|---|---|
> | Quantum Ring — wireless AE2 | Hydra, Fiery Ingot | **Sun Spirit**, Gold Key |
> | Draconium Core — all of Draconic | Knight Phantom, Knightmetal | **Valkyrie Queen**, Silver Key |
> | Fission Reactor Casing | Hydra, Fiery Ingot | **Sun Spirit**, Gold Key ×16 |
>
> **A silent dead-end was caught in the process.** SkyForge's datapack ships a Fission Reactor
> Casing recipe demanding a Twilight `fiery_ingot`. With Twilight removed that item no longer
> exists, so the recipe failed to load and the casing became **uncraftable** — which would have
> blocked Age VI with no error message. It is re-gated onto the Aether ladder.
>
> **The Celestial Core** — the centre of the win condition — was five Twilight trophies. Four
> map onto Aether dungeon keys (Slider, Valkyrie Queen, Sun Spirit, and Deep Aether's Eye of the
> Storm); the fifth went to Cataclysm's Netherite Monstrosity, because the Aether has no fifth
> boss. Ad Astra was considered and rejected — it ships no entity loot tables at all, so it has
> no bosses to gate on, and it is already represented by its three planet metals.
>
> **v1.22.x — Progression rebalance + 13 addons + performance. 184 mods.**
>
> &nbsp;&nbsp;*(Superseded above: the Twilight gates described here are now Aether gates.)*
>
> **AE2 was locked behind a full space program.** The chain to a *basic* ME network was:
> kill the Wither → NASA Workbench → build a rocket → fly to the Moon → *that* unlocks the
> Twilight portal → fight to the Naga → kill it → only then can you craft an ME Controller.
>
> Three gates had stacked without anyone noticing they compounded: SkyForge's datapack put a
> Nether Star on the NASA Workbench, `twilightforest-common.toml` had
> `portalUnlockedByAdvancement = "ad_astra:moon"`, and the adventure-gating script put the ME
> Controller behind the Naga. Twilight Forest is a **mid-game** dimension — gating it behind
> space inverted the whole pack.
>
> The rule now is **getting into a mod is mid-game, mastering it is earned**:
>
> | Stage | Gate |
> |---|---|
> | Basic AE2 — controller, drives, terminals, cells, buses | **ungated** |
> | Twilight Forest | **portal now open from the start** |
> | AE2 autocrafting — Crafting Unit, Molecular Assembler | Naga |
> | Space | Nether Star (Wither) |
> | Computers, Advanced Peripherals | Mars |
> | Wireless AE2 — Quantum Ring | Hydra |
> | Spatial IO, all MEGA cells | Venus |
> | Draconic Evolution | Knight Phantom |
>
> Basic AE2 is not a free ride — the Inscriber still requires a Mekanism Advanced Control
> Circuit, so you earn *storage* by building a power base and *automation* by killing something.
>
> **13 addons added**, every mandatory dependency verified before install:
> **Thermal** Cultivation, Innovation, Locomotion and Integration (the four official modules the
> pack was missing alongside Foundation/Expansion/Dynamics); **Ars Énergistique**, **Applied
> Botanics** and **Applied Flux** (Ars Nouveau, Botania and Thermal bridges into AE2);
> **Create: Enchantment Industry**, **Create Deco** and **Create Jetpack** (plus **Create:
> Dragons Plus**, a required library); **Ars Creo**; and **Crafting on a Stick**.
>
> ⚠️ These register items, so a client without them **will** be rejected on join.
>
> **Crafting a stack no longer freezes the server.** The pack has **30,765 recipes**, and
> vanilla matches a craft by scanning that list linearly *every single time*. Shift-clicking
> a stack is up to 64 crafts back to back, which stalls the server mid-tick. Two mods fix it:
> **FastWorkbench** caches the last recipe and only re-matches when the grid contents actually
> change (cutting match operations from ~600 to **1**), and **FastSuite** replaces linear
> scanning with an indexed lookup across the whole recipe system. Both are MIT, by the
> Apotheosis author, and rely on Placebo which the pack already ships.
>
> Crafting cannot be made client-side — it is server-authoritative by design, or clients
> could craft anything. Making the server's lookup cheap is the fix.
>
> **Four keystone bridge recipes were colliding.** `ae2_bridge_certus`,
> `mekanism_bridge_fluorite`, `mekanism_bridge_osmium` and `powah_bridge_uraninite` were all
> shapeless with the *identical* ingredient set — 1 keystone + 2 sky dust. Minecraft returns
> the first shapeless match, so only one of the four was craftable and the other three were
> dead. Since a void world has no ore, that silently gated AE2, the Mekanism fission fuel
> line and Powah behind a coin flip. All four are now **shaped** with distinct arrangements —
> same cost, same outputs, no balance change.
>
> Also added **spark** (`/spark health`, `/spark profiler`) and tuned the server JVM:
> `-Xms4G -Xmx4G` with Aikar's flags, down from an untuned `-Xmx6G` — about 2 GB back to
> the OS on a 16 GB machine.
>
> **Client JVM args must be set in the launcher UI, not by editing
> `launcher_profiles.json`.** The Minecraft launcher keeps that file in memory and rewrites
> it on exit, silently discarding any external edit. Installations → your Forge profile →
> ⋯ → Edit → More Options → JVM arguments.

> **v1.20.0 — The quest book, rebuilt. 357 → 578 quests, one mod per chapter.
> 167 mods.**
>
> No mod changes and no recipe changes. This is the release v1.19.0 should have been.
>
> **What went wrong last time.** v1.19.0 rewrote quest *descriptions* and added exactly **one**
> quest. Opening the book, nothing looked different — same boxes, same grid. The complaint was
> fair: "more in-depth quests" meant *more quests*, not longer text on the existing ones.
>
> **This release adds 220.** Real quest entries — icon, item task, subtitle, dependency wiring —
> covering the machines and mechanics the book simply never mentioned.
>
> | Chapter | Was | Now |
> |---|---|---|
> | Mekanism | 24 | **63** |
> | Applied Energistics | 31 | **49** |
> | Create | 16 | **46** |
> | Thermal | 16 | **25** |
> | SFM / XNet / routers | 15 | **23** |
> | RFTools | 8 | **21** |
> | Powah | — | **21** |
> | Storage | 12 | **18** |
> | Industrial Foregoing | 8 | **17** |
> | Ender IO | 7 | **17** |
> | Ars Nouveau | 7 | **15** |
> | Draconic Evolution | 5 | **14** |
> | Productive Bees | 8 | **14** |
> | Neural Networks | — | **12** |
> | Advanced Peripherals | 4 | **12** |
> | Toolkit | 6 | **10** |
> | Compact Machines | 3 | **8** |
> | Advanced Generators | — | **8** |
> | Solar Flux | — | **7** |
> | FTB Chunks | 2 | **5** |
>
> **One mod, one questline.** `age3_power` was a *themed* chapter holding eight different mods —
> Powah, Mekanism, MekanismGenerators, Hostile Networks, Extra HNN, Ex Deorum, Solar Flux and
> Advanced Generators — which made it impossible to see how far through any one of them you were.
> It has been dismantled into **four new chapters** (Powah, Neural Networks, Solar Flux, Advanced
> Generators), with the Ex Deorum tools moved into *Age I* and the Mekanism quests into
> *Mekanism*. Act II is now 16 chapters, one mod each.
>
> **Every moved quest kept its original id**, so completion progress survived the restructure.
>
> **Fixed: a broken icon that predated all of this.** `minecraft:tool_workbench` is not a real
> item, and it was the *Toolkit* chapter icon and its first quest's icon — both rendering as
> missing-texture cubes. Found by rebuilding the id validator: the old one only read
> `models/item/*.json`, which misses mods that register blocks via lang files (Solar Flux panels
> are `sp_1`–`sp_8`) and never checked vanilla at all. The new one reads item models, blockstates,
> `en_us.json`, `en_us.lang` **and the vanilla 1.20.1 jar** — 26,745 entries.
>
> **Validation on the finished book: 0 broken ids, 0 duplicate quest ids, brackets balanced in
> all 32 files.** Boot-tested clean after every batch.
>
> The writing targets what actually stops people rather than restating recipes — a pipe network
> with no Mechanical Pump does nothing; contraptions only move blocks that are *attached*; every
> AE2 cell tier holds 63 types regardless of size; Draconic Energy Core pylons default to input,
> which is why a new core appears to swallow power; a Pattern Provider must physically touch its
> machine or the job stalls forever.
>
> **v1.19.1 — Quest detection fix, and one duplicate HUD mod removed. 167 mods.**
>
> ⚠️ **This release removes a mod, so you must re-download the zip.** A mismatched mod list will
> get you kicked on join.
>
> **Fixed: quests silently failing to detect items.** `progression_mode` was set to `linear`,
> which means a quest whose dependencies are unmet is *locked* — and **locked quests do not run
> item detection at all**. Craft something ahead of the book's expected order and the progress
> was silently lost, with no feedback, because item tasks don't consume the item either. This was
> found after a Precision Mechanism was crafted and the Age II capstone stayed empty. It affected
> **every item task in the pack**, not just that one. Now set to `flexible`: tasks detect
> regardless of dependency state, so the book reflects what you have actually done.
>
> **Also softened eight chapter capstones** with `min_required_dependencies: 1` — *The Machine
> Age*, *Powered Up*, *Gather the Relics*, *HEART OF THE SKY*, *The Universal Pipe*, *The Base
> Thinks*, *Industrialised* and *Liftoff*. Dependencies only control when a quest unlocks in the
> book; the **task** is what actually gates completion. Finishing any one branch now reveals the
> chapter goal instead of hiding it behind every side quest, and nobody can skip real content.
>
> **Neither change affects progression.** The pack's gating lives in the KubeJS recipe scripts,
> not in quest state — you still cannot craft an ME Controller without Naga Scales no matter what
> the book says.
>
> **Removed: The One Probe.** The pack shipped **two** block-info HUD overlays doing the same
> job — Jade and The One Probe — both drawing on screen at once. Jade wins on three counts:
> **JadeAddons hard-depends on it**, so dropping Jade would have cost two mods rather than one;
> nothing in the pack has a mandatory dependency on TOP; and TOP's only two integrations (AE2 and
> Pipez) both support Jade as well. Nothing is lost. If you were carrying a Probe item it has
> been removed from your inventory.
>
> Boot-tested clean (`Done (2.516s)`) with 167 mods.
>
> **v1.19.0 — The quest book rewrite. It now teaches the mods instead of
> listing them. 168 mods.**
>
> No mod changes and no recipe changes. This is the companion release to v1.18.0: that one
> rebuilt the *progression*, this one rebuilt the *explanation* of it.
>
> **The problem.** Most quests said what to craft and stopped. *"The ME Controller is the heart
> of a network."* True, useless. Nothing explained how a mod actually worked, what would go
> wrong, or — after v1.18.0 — why half the tech tree now needed a dead boss.
>
> **Around 110 quests across 20 chapters were rewritten.** Highlights:
>
> **The gating is finally visible.** *The Gates* panel in **How to Play** was rewritten from
> scratch — it predated v1.18.0 and listed none of the new locks. It is now grouped into Tier /
> Dimension / Adventure / Ending, and ends on the line that matters: *everything up to the ME
> Controller you can build on your island; nothing after it.* Every Twilight boss and every
> planet now names the block it unlocks — the Naga is introduced as "the most important kill in
> the pack" because Naga Scales are the ME Controller.
>
> **Create** (your first real complaint) — all seven thin quests rewritten. RPM versus stress,
> gearing trading one for the other, the one-source-per-shaft rule behind most lockups, exact
> Basin/Mixer spacing, and Sequenced Assembly as the road to the Precision Mechanism.
>
> **AE2** — the bytes-versus-types distinction, and the punchline that **every cell tier holds 63
> types**; higher tiers give bytes, not types. That one fact explains why everyone's first network
> "fills up" instantly. Plus fluix being grown rather than crafted, crafting versus processing
> patterns, and why a pattern in an unattached Provider silently stalls a job.
>
> **Mekanism** — 13 quests. The Electrolytic Separator flagged as the pivot from items to gases,
> the 3x chain drawn out as four machines, Factories explained as parallel slots, and the
> Entangloporter's side-config gotcha that makes a new one look dead.
>
> **The Void Signal fights** read as optional flavour. Three of the four **Heart of the Sky**
> corners drop there. They now say so, with arena advice — roof the Venus arena or the acid rain
> fights you too, and the Glacio lich is **not** the Twilight lich.
>
> **Things you can only learn by dying** are now written down: a partial Space Suit provides *no*
> oxygen, the Harvester replants *nothing*, claimed is not the same as force-loaded, Free Runners
> stop protecting you the moment they run flat, and Ad Astra Steel is not Mekanism Steel.
>
> Boot-tested clean after every batch — fourteen times, all 28 chapters parsing, KubeJS reporting
> zero errors throughout.
>
> **Deliberately not padded.** Around 46 quests still have short descriptions: optional Cataclysm
> bosses, Blue Skies and Undergarden side-bosses, flag-planting on Mercury, aircraft, minor
> conveniences. Three paragraphs on "plant your flag" would make the book worse.
>
> **v1.18.1 — Quest book format pass. Every quest now has a subtitle and an icon.**
>
> No mod changes, no recipe changes, no gameplay changes. Cosmetic and clarity only.
>
> **69 quests across five chapters were missing their `subtitle` and/or `icon` fields** —
> *Applied Energistics*, *Mekanism*, *Space Program*, *War in the Sky* and *Realms Beyond*. In the
> book that reads as a wall of unlabelled boxes: no one-line summary under the title, and a blank
> frame where the item should be. Those five were the pack's most important chapters and its
> scruffiest.
>
> **All 358 quests in all 28 chapters now carry both.** Icons were derived from each quest's own
> task item where one existed; the remainder — boss kills and dimension visits, which have no item
> to read — were assigned by hand. The Twilight ladder now shows the actual trophy of the boss it
> asks you to kill, *Space Program* shows the surface of the world you are flying to, and the
> Cataclysm fights show the ingot they drop.
>
> Subtitles were written per quest rather than generated, so they say something useful:
> *"Purification: 3x per ore"*, *"Fiery Blood for the Quantum Ring"*, *"Unlocks the Twilight portal"*.
> Several double as gate reminders now that progression depends on them.
>
> Boot-tested clean (`Done (2.351s)`), all 28 chapters parsed, KubeJS 0 errors.
>
> **Still outstanding:** per-mod description depth. Most quests still explain *what* to craft
> rather than *how the mod actually works* — only the AE2 chapter got that treatment in v1.18.0.
>
> **v1.18.0 — Adventure gating. The Twilight Forest and the planets are no longer
> optional. 168 mods.**
>
> The pack had a real problem: **you could finish it without ever opening a Twilight portal or
> launching a rocket.** AE2, computers and the entire endgame sat in Act II–IV behind pure
> crafting, while Twilight Forest and Ad Astra were parallel side-content. Both adventure trees
> were skippable. This release makes them mandatory.
>
> **Added: KubeJS + Rhino** (`kubejs-forge-2001.6.5-build.26`, `rhino-forge-2001.2.3-build.10`).
> SkyForge's datapack already carried `GATE OVERRIDE` recipes, but Java + a Gradle rebuild for
> every balance tweak is too slow to iterate on. Gating now lives in scripts under `kubejs/`.
> Dependency check as always: Forge `[47.1.0,)` ✓ 47.3.0, Architectury `[9.1.12,)` ✓ 9.2.14,
> Rhino `[2001.2.2-build.1,)` ✓.
>
> **Nine mid-to-late recipe gates.** Each swaps a single ingredient of an existing recipe, so
> shapes are untouched and JEI still reads normally:
>
> | Unlock | Now costs | Where |
> |---|---|---|
> | ME Controller | Naga Scale | Twilight Forest — Naga |
> | Crafting CPU | Desh | The Moon |
> | Molecular Assembler | Desh | The Moon |
> | Advanced Computer | Ostrum ×1 | Mars |
> | Peripheral Casing | Ostrum | Mars |
> | Quantum Ring | Fiery Ingot | Twilight Forest — Hydra |
> | Spatial IO Port | Calorite | Venus |
> | Sky Steel → all MEGA cells | Calorite | Venus |
> | Draconium Core | Knightmetal | Twilight Forest — Knight Phantom |
>
> Two of these are chokepoints that gate far more than themselves: **Peripheral Casing** is in
> every Advanced Peripherals block, and **Sky Steel** is the base of every MEGA cell. Advanced
> Computer swaps its *redstone*, not its gold — one Ostrum each, a real gate you won't resent
> when crafting them in bulk.
>
> **New item: the Celestial Core.** Heart of the Sky already demanded seven boss kills, but every
> one came from BOMD, Cataclysm or the Wither — nothing from the Twilight Forest, nothing from the
> planets. The Core replaces the Nether Star at the centre of that recipe and costs **five Twilight
> boss trophies** (Naga, Lich, Hydra, Ur-Ghast, Snow Queen), **one ingot from each planet** (Desh,
> Ostrum, Calorite) and a Nether Star. Trophies drop only from the boss itself — they cannot be
> sieved, farmed or traded. **The ending went from 7 boss kills to 12.**
>
> **Quest book.** The AE2 chapter's Controller, Molecular Assembler, Crafting CPU, Quantum Ring
> and Spatial Storage quests were rewritten to teach the new gates, with missing subtitles and
> icons added. Ascension gained a **Celestial Core** quest naming every Twilight king and where
> each one lives. Early game is deliberately untouched — sieve, Create and basic Mekanism are
> exactly as they were. **Easy to start, harder to finish.**
>
> **Note on the client zip:** it now contains a `kubejs` folder alongside `mods` and `config`.
> Copy all three into `.minecraft`.
>
> **Known gap:** roughly 70 quests across *Mekanism*, *Space Program*, *War in the Sky* and
> *Realms Beyond* still lack subtitles and icons. Format pass to follow.
>
> Boot-tested clean three times (`Done (2.424s)`, `Done (2.306s)`, `Done (2.202s)`), KubeJS
> reporting 0 errors and 0 warnings, FTB Quests parsing every chapter without complaint.
>
> **v1.17.0 — Create: Power Grid. Real electrical simulation for Create. 166 mods.**
>
> **Added: Create: Power Grid** (`powergrid-mc1.20.1-0.5.5.1`). The pack already had Create and
> Create Crafts & Additions, so it could turn rotation into FE and back — but FE is a fiction where
> power teleports down a wire with no losses and no failure modes. Power Grid replaces that with an
> actual **network-analysis simulation**: circuits must form closed loops before any current flows,
> voltage sags when demand outruns supply, and higher voltage moves more power with fewer
> transmission losses. Under-build your generation and you don't just stall — you **damage the
> equipment and the blocks around it**. Overheat behaviour is configurable if that turns out to be
> too punishing.
>
> What it adds to build with: **Electric Motor** (electricity → SU, closing the loop with Crafts &
> Additions), **Basin Heater** (an electric blaze burner), **Heating Coil** (faster bulk smoking and
> blasting), **Electric Fan**, **Servo** (a motor positioned precisely by voltage), **Electromagnet**
> (unlocks item magnetisation as a new processing recipe), **Growth Lamp** (light plus crop
> acceleration — useful on a void island), **Light Bulb** and **Alarm Bell**. It also speaks
> **Forge Energy**, so it drives Mekanism, AE2, RFTools and everything else in the pack directly.
>
> The deep end is **custom circuit boards**: lay out resistors, capacitors and vacuum tubes, route
> the traces, then etch and populate the board. In-game **Ponders** cover every mechanic, so this
> doesn't need quest scaffolding to be learnable.
>
> **Dependency check before install**, same as every release: `mods.toml` declares Forge `[47,)`
> (pack runs 47.3.0 ✓), Minecraft `[1.20.1,)` ✓, Architectury `[9.2.14,)` (pack has exactly
> 9.2.14 ✓) and Create `[6.0.7,6.1.0)` — the pack runs **Create 6.0.8**, inside the range ✓. No new
> dependencies needed. The 0.5.5.1 build is specifically the one that *"removed relay volume code
> which crashed dedicated server"*, so it is the correct pick for a server pack.
>
> **No quest coverage yet** — the mod's Ponders carry it for now; a chapter can follow.
> **Not yet boot-tested** — installed while the server was down and not restarted.
>
> **v1.16.0 — Gateways to Eternity, crouch-growth rework, and the Just Potion Rings
> crash fix. 165 mods.**
>
> Three changes in one release. **This supersedes v1.15.1, which was never published** — its Just
> Potion Rings fix is included here.
>
> **Added: Gateways to Eternity.** Craft a **Gate Pearl**, use it on a block, and it opens a
> wave-based combat event that spawns hostile mobs for you to fight. Rewards are
> `gateways:entity_loot` — the mob's *own* drop table, rolled 10–15× per wave and scaling with each
> wave — which makes this a real answer to the void-skyblock problem of mobs you can never
> encounter. Biome-locked and dimension-locked mobs no longer dead-end progression: you fight for
> their drops instead of waiting for a spawn that will never happen. Seven gateways ship craftable
> (blaze, enderman, slime, emerald grove, hellish fortress, overworldian nights, endless blaze),
> and gateways are datapack-defined, so more can be added later. **No new dependencies** — it needs
> Placebo and Apothic Attributes, both already in the pack.
>
> **SkyForge 0.17.0 — crouch-to-grow reworked.** The old behaviour fired a growth pulse every 10
> ticks *for as long as sneak was held*, so two seconds of ordinary crouching bone-mealed a 7×7 area
> four times over. Sneak is movement — edging along a block, taking stairs, not falling off the
> island — so this grew crops as a side effect of getting around, and there was no way to aim it.
> Now:
> - **One pulse per press.** Growth fires on the moment sneak goes down and never again until you
>   release it. Spam crouch to grow deliberately; incidental sneaking costs at most a single stage.
> - **3×3 instead of 7×7.** A crouch affects what is at your feet, not a whole field nearby.
> - **Particles, no sound.** Vanilla's bone-meal `levelEvent` fires particles *and* the sound
>   together, so the particles are now sent directly instead. Sneak gets held for long stretches; a
>   sound on every pulse would be unbearable.
> - **Deterministic.** The old code consulted vanilla's `isBonemealSuccess`, a random roll that
>   fails ~55% of the time on saplings — which read as "broken" rather than "slow". Valid targets
>   now always grow.
> - **Mystical Agriculture is limited by tier, not banned.** Inferium, Prudentium and Tertium respond
>   to crouching; **Imperium, Supremium and Insanium do not**, so the early essence grind is quick
>   without trivialising endgame essence. The tier is read from Mystical Agriculture's own API at
>   runtime and **fails closed** — if that API ever changes, it reverts to excluding all MA crops
>   rather than leaking a high-tier one.
>
> **Removed: Just Potion Rings — it was hard-crashing the server.** Its `LivingEntity` mixin calls
> `HandlerRing.equippedEffects()` on *any* entity that takes damage, and that returns `null` for
> mobs, which have no Curios ring slots — instant `NullPointerException` on the server thread. A
> zombified piglin standing on a magma block in a force-loaded chunk triggered it **three times in
> ten minutes, twice with nobody online**, so the server could not stay up even idle. There was no
> fix short of removal: v2.0 is already the newest build, and the mod's config only covers JEI/REI
> display and loot tables — nothing restricts the mixin to players. Its config and its quest in
> *The Toolkit* chapter went with it. **Any potion rings you were carrying are gone.**
>
> **v1.15.1 (superseded, never published) — server crash fix. Just Potion Rings removed.**
>
> **Just Potion Rings was crashing the server.** Its mixin on `LivingEntity` calls
> `HandlerRing.equippedEffects()` on *any* living entity that takes damage, and that returns
> `null` for mobs, which have no Curios ring slots. The result is a `NullPointerException` on the
> server thread and an immediate hard crash.
>
> The trigger here was a zombified piglin standing on a magma block in a force-loaded chunk at
> `(-89, 36, 77)`. Magma damage → mixin → null → dead server. It crashed **three times in ten
> minutes**, including twice with nobody online, so the server could not stay up even idle.
>
> There is no fix short of removal: **v2.0 is already the newest build** (June 2026), and the
> mod's config only controls JEI/REI display and loot tables — nothing disables the mixin or
> restricts it to players. The mod is gone, along with its config and its quest in *The Toolkit*
> chapter (which would otherwise have asked for an item that no longer exists).
>
> **You lose the potion rings.** Any rings already in inventories or storage will disappear.
> Everything else is unchanged — 28 chapters, all v1.15.0 content intact.
>
> **v1.15.0 — quests for the automation update. No mod changes.**
>
> v1.14.0 added 40 mods and zero quests. This fixes that: **28 chapters**, with the new mods
> integrated into the book properly rather than dumped in a patch-notes chapter.
>
> **Mods are grouped by how they work, not one chapter per mod.** Only two genuinely new ways of
> playing earned their own chapter; everything else was folded into the chapter that already
> teaches the same idea.
>
> **New: &bProgram the Base&r** (Act II) — 15 quests across four parallel branches that all
> replace "re-wrench every pipe side" with something you can read back: **Super Factory Manager**
> (write it in near-English), **XNet** (declare it in a table), **Integrated Dynamics + Tunnels +
> Crafting** (describe the conditions and let them drive), and **PneumaticCraft** (hand a drone a
> jigsaw flight plan).
>
> **New: &6The Second Industry&r** (Act II) — 16 quests covering **Thermal** (Foundation,
> Expansion, Dynamics) and **Immersive Engineering**, the two gentlest on-ramps to ore processing,
> approached from opposite ends: one block that just works, versus a structure you walk inside.
>
> **Refined Storage has been merged into the Applied Energistics chapter.** It was a separate Act I
> chapter despite solving exactly the same problem AE2 does. It is now a parallel branch in one
> "network storage" chapter, which is where a player learning that idea will actually look.
>
> **Folded into existing chapters:** Pretty Pipes, Modular Routers, Item Collectors and Pipe
> Connector → *Pipe Dreams*. PackagedAuto, Cable Tiers and Requestify → *Applied Energistics*.
> Solar Flux and Advanced Generators → *Age IV · Power*. Botany Pots → *Essence Farming*. Botania
> and Occultism → the Ars Nouveau chapter, now retitled **The Magic Branch** to match its actual
> contents. IF: Souls → *Industrial Foregoing*. Ender Storage, EnderTanks and Entangled →
> *Stash & Sort*. Iron Jetpacks → *Sky Gadgets*.
>
> **Also fixed:** two quests in the Productive Bees chapter ("The Breeding Chamber" and "Productive
> Trees") were rendering on top of each other at identical coordinates — a leftover from the
> v1.12.0 Productive Trees append, which landed after that release's overlap audit had run.
>
> Every item referenced by a new quest task was verified to be a real, craftable item by reading
> recipe outputs straight out of the mod jars — **77 IDs checked automatically**, plus Solar Flux
> by hand because it ships no recipes in its jar. That caught three that would have produced
> permanently uncompletable quests: XNet has no craftable *uncoloured* cable or connector (only
> dyed variants), Thermal Dynamics on 1.20.1 has **no item duct at all** (energy and fluid only),
> and Solar Flux registers its panels as `sp_1`, not `solar_panel_1`. The whole book was then
> boot-tested and cleanly shut down with **all 28 chapters byte-identical afterwards**, which is
> the only real proof FTB Quests accepted them unmodified.
>
> **v1.14.0 — the automation update. 40 new mods, 125 → 165.**
>
> The pack was never short on *machines* — it was short on **ways to move things between them**.
> Logistics jumped straight from hoppers and Pipez to a full AE2 network, with nothing in the
> middle, so most builds skipped the stage where automation is actually fun. This update fills
> that gap.
>
> **The headliners**
>
> | Mod | What it does |
> |---|---|
> | **Super Factory Manager** | Write short plain-English programs (`EVERY 20 TICKS DO INPUT FROM chests OUTPUT TO furnaces`) that move items, fluids and energy across a whole labelled network from one block. The single biggest quality-of-life jump in the update. |
> | **XNet** | One cable and one controller GUI: item/fluid/energy/logic channels with filters and priorities, configured centrally instead of per-pipe. |
> | **Modular Routers** | One block plus up to 9 modules (extractor, placer, breaker, vacuum, activator…) replaces an entire pipe network. Cheap and available very early. |
> | **Pretty Pipes** | Cheap item pipes with filters, plus a **Crafting Terminal** that gives you AE2-style autocrafting out of plain chests long before AE2 is realistic. |
> | **PneumaticCraft: Repressurized** | Pressure-based tech whose headline is **programmable drones** — build a program out of puzzle-piece widgets and a drone flies off and does it. |
> | **Thermal Foundation / Expansion / Dynamics** | Simple 1-in/1-out machines with auto-eject and in-place augment upgrades, plus ducts with built-in filtering. The gentlest automation on-ramp in the pack. |
> | **Integrated Dynamics** (+ Tunnels, Crafting) | A logic and data network — readers, writers and an operator system that amounts to functional programming in-world. Highest ceiling here. |
>
> **Hands-off resource loops** — the pack's other gap. **Botany Pots** grows any crop or sapling
> with no farmland, water or light and drops straight into a hopper. **Botania** brings mana,
> functional flowers that haul/place/grow, and the **Corporea** wireless request network.
> **Occultism** summons familiars that mine and haul with no cables at all. **Industrial
> Foregoing: Souls** adds a mob-soul chain onto the IF you already run, and **PackagedAuto** lets
> AE2 autocraft machines that need multiple simultaneous inputs or produce multiple outputs —
> the classic AE2 pattern gap. **Item Collectors** vacuum drops into any inventory.
>
> **Power, wireless and misc**: Immersive Engineering (multiblock machines + conveyors), Solar
> Flux Reborn, Advanced Generators, Ender Storage, EnderTanks, **Entangled** (links any two
> blocks remotely — a partial stand-in for the still-unavailable Flux Networks), Cable Tiers,
> Refined Storage: Requestify, Pipe Connector, Iron Jetpacks.
>
> **Deliberately left out.** Simple Storage Network, Functional Storage and Extreme Reactors were
> downloaded and then dropped — they duplicate Tom's Simple Storage, Storage Drawers and
> Mekanism's fission reactor respectively. **LaserIO, Mob Grinding Utils, Woot, Just Dire Things,
> Actually Additions, Routers and Flux Networks have no Forge 1.20.1 build** (NeoForge-only or
> CurseForge-exclusive), so none of them could be included — LaserIO is the most painful miss.
>
> Every jar was checked against this pack's **Forge 47.3.0** before install by reading
> `loaderVersion` and the `minecraft` version range straight out of its `mods.toml` — the same
> check that caught FTB Ultimine and killed Mekanism Curios. Two catches worth recording: SFM
> declares `loaderVersion "[47,)"` but its real forge dependency is `[47.1,)`, and Item Collectors
> ships as `mc1.20.2` in its filename while its actual range is `[1.20,1.20.3)`. **Boot-tested
> clean twice** (`Done (2.674s)` at 162 jars, `Done (2.101s)` at 165) with zero
> `LoadingFailedException` and no missing dependencies. This release also syncs 206 server config
> files that had drifted out of the repo snapshot since v1.8.0.
>
> **These 40 mods have no quest coverage yet** — that's the next release.
>
> **v1.13.1** — Two fixes, no mod changes. **Quest book text repaired:** 69 garbled
> characters across 15 chapters (chapter titles showing `Â·` instead of `·`, and `â†’` instead of
> `→` in progression chains) were double-encoded UTF-8 and rendered as mojibake in-game — all
> fixed. **The auto-crafting checkbox is gone from crafting tables:** that was Inventory Profiles
> Next's "Continuous Crafting" checkbox, now disabled via `show_continuous_crafting_checkbox: false`
> in `config/inventoryprofilesnext/inventoryprofiles.json`. IPN's sort/move-all buttons and
> auto-refill are untouched.
>
> **v1.13.0** — Added **Pipez** (`pipez-forge-1.20.1-1.2.26`): cheap iron-tier pipes for
> items, fluids, energy and Mekanism gas, plus a Universal Pipe that carries all four in one block.
> One Wrench configures every side (extract/insert, filters, round-robin/nearest/furthest/random
> distribution, redstone control) and upgrades run Basic → Improved → Advanced → Ultimate for
> throughput and filter slots. Its optional integrations (Mekanism gas pipes, JEI, Jade, The One
> Probe) are all already in the pack, so they light up automatically. New **Pipe Dreams** quest
> chapter (9 quests, Act I) covers the whole ladder. **RFTools was also requested but the full
> suite was already in the pack since v1.11.0** (Base, Builder, Control, Dimensions, Power,
> Storage, Utility + McJtyLib, with its own quest chapter) — nothing to add.
>
> **v1.12.0** — Quest book rebuilt: retired the "New Arrivals" junk-drawer chapter.
> Every addon mod now gets real quests like every other mod — either its own dedicated chapter
> (Compact Machines, Refined Storage, FTB Chunks, The Toolkit, Advanced Peripherals, RFTools, Ars
> Nouveau, Draconic Evolution) or folded into the existing chapter it extends (Mekanism Additions →
> Mekanism, AE2 Wireless Terminals/Extended AE/MEGA Cells → AE2, Ex Machinis → Age I, Create Steam
> 'n' Rails/Crafts & Additions → Age II, Productive Trees → Productive Bees, Extra Hostile Neural
> Networks → Age IV). 26 chapters, 300 quests, boot-tested clean.
>
> **v1.11.1** — Quest book updated: the **New Arrivals** chapter now covers the v1.11.0
> mods too (Compact Machines, Draconic Evolution, Refined Storage, Ars Nouveau, RFTools, MEGA
> Cells, FTB Chunks). Also audited the whole 19-chapter quest book for corruption (duplicate IDs,
> broken dependencies/chapter-group refs, overlapping quest positions) — found none, book was
> already clean.
>
> **v1.11.0** — Big content drop: **Compact Machines** (pocket-dimension rooms), **Draconic
> Evolution** (+ Brandon's Core, CodeChicken Lib — endgame reactors/gear), **Refined Storage** (a
> second, independent network-storage system alongside AE2), **Ars Nouveau** (spellcrafting magic
> - this pack's first magic mod), **RFTools full suite** (Base, Utility, Builder, Power,
> Dimensions, Storage, Control + McJtyLib), and **MEGA Cells** (AE2 addon, massive single storage
> cells) + **FTB Chunks** (chunk loading, useful for unattended automation). **Flux Networks was
> requested but could not be included** - CurseForge blocks third-party downloads for it and it
> isn't on Modrinth; skipped rather than risk a broken link.
>
> **Latest: v1.10.0** — Added **Construction Wand** (the actively-maintained successor to the
> classic "Builder's Wand" — place a block, then extend a whole surface of matching blocks with
> one click).
>
> **Latest: v1.9.0** — 15 addon mods added for existing tech/farming (Mekanism Additions, AE2
> Wireless Terminals, Extended AE + Glodium, Create: Steam 'n' Rails, Create Crafts & Additions,
> Tom's Performant Storage, Extra Hostile Neural Networks, Productive Trees, Advanced Peripherals,
> Quests Additions, Ex Machinis: Divitiae Deorum, Elytra Slot + Caelus API, Just Potion Rings).
> All are announced in-game under a new **New Arrivals** quest chapter. **Mekanism Curios was
> tested and dropped** — every 1.20.1 build (including its first release) requires Forge 47.4.0+,
> confirmed via live boot crash, not just the changelog; this pack stays on 47.3.0.
>
> **Latest: v1.8.0** — Added **Jade** (hover any block/entity for a tooltip: contents, progress,
> owner — replaces the old "just install TheOneProbe and guess" experience) plus **Jade Addons**
> for extra tooltip providers (AE2, Mekanism, Waystones, Mystical Agriculture, StorageDrawers,
> Ex Deorum, Twilight Forest, and more — all picked up automatically, confirmed via a live boot
> log). Also added **Inventory Profiles Next** (one-click full-inventory sort, auto-refill broken
> tools/stacks, auto-dump into matching containers) with its two hard dependencies, **libIPN** and
> **Kotlin for Forge**. JEI, Curios, AppleSkin, Clumps, Waystones, Embeddium, FerriteCore,
> ModernFix, EntityCulling, Controlling, Xaero's Minimap/Worldmap, and Immersive Aircraft were
> already in the pack — no changes needed there.
>
> **Latest: v1.2.0** — SkyForge 0.14.0 adds **crouch-to-grow**: hold sneak near crops and they grow
> automatically, no bone meal item needed. Mystical Agriculture crops (all tiers) are excluded, so essence
> crops can't be cheesed. (v1.1.0 added Extended Bone Meal + Collective — sneak + a bone meal *item* to
> instant-grow.) **Every update requires everyone to re-download the matching client zip and replace their
> `mods` folder, or they can't join.**
>
> **Vein mining:** **Server-side Vein Miner & Tunneler** (`svmm`) — hold sneak + break an ore or log to
> vein-mine it (`/svmm enable` per player; toggle with `/svmm`). It declares itself server-only
> (`side="SERVER"` in its own manifest), so it's harmless either way — included in the client zip for
> consistency, but a client missing it can still join fine.
>
> **QoL:** **Mouse Tweaks** (shift-drag/right-click-drag item sorting), **Controlling** (keybind
> conflict UI, client-only — server doesn't require it, needs **Searchables** as a library dep),
> and **AppleSkin** (hunger/exhaustion display). None of the three block a mismatched client from
> connecting.
>
> **FTB Ultimine is included — pinned to v2001.1.4**, not the latest CurseForge file. The newest
> build (`2001.1.8`) crashes on this pack's Forge 47.3.0 (`NoSuchMethodException` on its own
> constructor); `v2001.1.5`+ requires Forge 47.4.0, which this pack doesn't run. `v2001.1.4`
> (Jan 2024) predates that requirement and loads clean — confirmed via a live boot test (network
> channels registered successfully, not just "didn't crash"). **Do not update this specific mod**
> without also upgrading Forge, or it will break again.
>
> There is **no cobble generator, and the starting chest is intentionally
> empty** — every island starts with nothing but its tree, by design. Everything is craftable from
> wood alone:
>
> 1. **Punch the tree** for logs → craft planks, sticks, slabs.
> 2. **Craft a Crook** (2 sticks) and use it on the tree's **leaves** — repeatedly, it strips them for
>    saplings without destroying the leaf, with a small chance of a **Silk Worm**, and a much better
>    chance of **String** once a leaf becomes "infested." String → **String Mesh** (9 string, 3×3).
> 3. **Craft an Oak Sieve** (planks + slab + stick) and an **Oak Barrel** (planks + slab). Compost
>    leaves/saplings in the barrel for **Dirt** (fully renewable — hover the barrel with The One Probe
>    to see fill progress).
> 4. **Load the mesh into the sieve** (right-click with mesh), then **sift dirt** (right-click with
>    dirt) for **Stone Pebbles** → craft 4 into **Cobblestone**.
> 5. **Craft a Wooden Hammer** (planks + stick) and hit cobblestone for **Gravel** (then Sand, Dust).
> 6. Upgrade meshes (String → Flint → Iron → Diamond → Netherite) by sieving gravel/sand for rarer
>    drops as you go.
4. Launch with the Forge 1.20.1 profile and connect to the server address:

   ```
   ttsskyboys.duckdns.org:25565
   ```

   The server is open to the internet with **no whitelist** — anyone with this address can join.

## Host the server

1. Copy the `server/` folder to your host machine and add the mod jars + a Forge 1.20.1-47.3.0
   server install (not included here — same jars as the client set).
2. **Set an RCON password** before first run: put a value after `rcon.password=` in
   `server/server.properties` and the same value in `server/rcon-cmd.ps1` (both are blanked/
   placeholdered in this repo on purpose). Do **not** port-forward the RCON port (25575).
3. Run `start-server.bat`. Type `stop` in the console — or run `stop.bat` — to shut down cleanly.

Players create their own island and pick a template with `/skyblock create` (templates:
default, Desert, Mushroom, Snowy).

## SkyForge (custom mod)

Adds a Forge-Energy machine + a resource-progression chain feeding Mekanism/AE2, and an
optional in-game `@claude` chat bridge. The Anthropic API key is **never** stored in the jar
or committed — it's read at runtime from `config/skyforge-claude.json` (`apiKey` is empty here).

**Textures (v0.15.0+):** SkyForge's items/blocks now use original art instead of reused vanilla
textures. Every source is either generated for this project or explicitly CC0 (public domain) —
see [`skyforge/TEXTURE_CREDITS.md`](skyforge/TEXTURE_CREDITS.md) for exact sources. None are
pulled from any mod bundled in this pack.

## Licensing note

This pack bundles third-party mods. They remain under their respective authors' licenses;
all credit goes to the original mod authors. If you are a mod author and want your mod
removed from the distribution, open an issue.
