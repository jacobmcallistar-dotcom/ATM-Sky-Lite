# ATM Sky Lite — hybrid Minecraft 1.20.1 Forge modpack

A void-skyblock pack with an **8-Age tech / space / boss progression** and a real win
condition, built around a custom mod (**SkyForge**). Minecraft 1.20.1, Forge 47.3.0, **79 mods**.

Two pieces:

1. **`modpack/`** — the distributable (CurseForge-format `manifest.json` + `overrides/`
   holding `mods/` and `config/`). This is what you'd zip and share.
2. **`skyforge/`** — the custom Forge "glue" mod, built from source. Currently **v0.13.0**.
3. **`server/`** — a ready-to-run dedicated server (see *Hosting* below).

---

## What SkyForge adds (v0.13.0)

The pack's custom backbone. Everything is baked into the mod jar (recipes, block, event handlers).

- **Sky Assembler** machine + `sky_dust → sky_steel → keystone` chain; keystone bridges to
  osmium / certus / uraninite (the entry into Mekanism / AE2 / Powah without ore).
- **Void rescue** — falling into the void doesn't kill you; you're caught and dropped back in
  from the sky above your last safe ground, no death, no lost items.
- **Craftable lava & water buckets** (bucket + 8 cobblestone; bucket + 8 leaves) — renewable
  and AE2-autocraftable, so the fluids that feed machines never run out.
- **AE2 inscriber press recipes** (presses are otherwise meteorite-only).
- **Mystical Agriculture seeds** for the Ad Astra planet ores (desh / ostrum / calorite) — the
  only progression resources with no other automation path. Note: they register under the
  `mysticalagriculture:` namespace (e.g. `mysticalagriculture:desh_seeds`), not `skyforge:`.
- **15 structure-set overrides** that stop vanilla structures (mineshafts, villages, ruined
  portals…) generating in the void.
- **In-game Claude** — type `@claude <question>` in chat and Claude answers (and can run
  commands to help). Requires an Anthropic API key; see *In-game Claude* below.

---

## Building SkyForge

Requires **JDK 17**. From `skyforge/`:

```
set JAVA_HOME=<path to a JDK 17>
gradle build --no-daemon
```

Output jar: `skyforge/build/libs/skyforge-1.20.1-0.13.0.jar`. After building, copy it into
**both** `../modpack/overrides/mods/` (distributable) and your live `.minecraft/mods/`
(what you actually play), replacing the old `skyforge-*.jar`.

> `skyforge/libs/` holds compile-only copies of Mystical Agriculture + Cucumber (for the crop
> API). If you version-control the mod, gitignore that folder.

---

## Playing (single-player)

The live install is `.minecraft/` with launcher profile **forge** (`-Xmx6G`). Pick that
profile and create a **new world** — the custom starter islands, quest book, and structure
rules only apply at world creation, so an existing world won't pick up changes.

On world creation you choose a starter island (Default / Desert / Mushroom / Snowy). Each ships
a chest with a lava bucket + ice — the mandatory bootstrap. There is no mining: you **sieve**
for everything (Ex Deorum). Press **R** / **U** in JEI to look up recipes.

---

## Hosting a server (play with a friend)

The `server/` folder is a **self-contained dedicated server** — it bundles its own Java 17
runtime, so nothing needs installing.

1. Double-click **`server/start-server.bat`**. First launch generates the world (takes a
   minute); wait for `Done (…)!` in the console.
2. **You** (same PC) join via Multiplayer → Direct Connect → `localhost`.
3. **Your friend** needs to reach your PC. Two options:
   - **Easiest — a tunnel:** install [playit.gg](https://playit.gg) (free), point it at port
     `25565`, and give your friend the address it prints. No router config.
   - **Port forwarding:** forward TCP **25565** to your PC in your router, then give your friend
     your public IP. (`allow-flight` is already on, needed for jetpacks/elytra.)

Config lives in `server/server.properties` (motd, max-players, difficulty). To change the RAM
the server uses, edit `server/user_jvm_args.txt` (default `-Xmx6G`).

> Skyblock note: SkyBlock Builder gives each team its own island. To share one island, join the
> same team in-game (`/skyblock` menu / commands); to play separate islands, each create your own.

To stop the server, type `stop` in its console (never just close the window — that risks a
corrupt save).

---

## In-game Claude (optional)

`@claude <question>` in chat routes to the Anthropic API and answers in chat; it can also run
server commands to fix or hand out things. Needs a paid **Anthropic API key** (billing is
separate from any Claude Code subscription — every message costs API credits).

1. Get a key at **console.anthropic.com** → Billing (add credits) → API keys → Create.
2. Paste it into `config/skyforge-claude.json` → `"apiKey"`, then restart.

Config knobs: `model` (default `claude-opus-4-8`; `claude-haiku-4-5` is ~5× cheaper for a chat
bot), `trigger` (default `@claude`), `allowCommands`, `opOnly`. Every command it runs is echoed
to chat before it executes.
