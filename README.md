# ATM Sky Lite

A Minecraft **1.20.1 Forge** void-skyblock modpack (81 mods) built around Mekanism +
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
[**Releases**](../../releases) page (`ATM-Sky-Lite-client.zip`), or let a CurseForge-style
launcher resolve them from `manifest.json`.

## Install (to play)

1. Install **Forge 1.20.1 – 47.3.0** from <https://files.minecraftforge.net/> ("Install client").
2. Launch the Minecraft launcher once, pick the new Forge profile, then close it.
3. Download `ATM-Sky-Lite-client.zip` from Releases and copy its `mods` and `config`
   folders into your `.minecraft` (`%appdata%\.minecraft`), merging/replacing.
   - Your `mods` folder must contain **exactly** these 81 mods — remove any extras or you'll be kicked on join.

> **Latest: v1.2.0** — SkyForge 0.14.0 adds **crouch-to-grow**: hold sneak near crops and they grow
> automatically, no bone meal item needed. Mystical Agriculture crops (all tiers) are excluded, so essence
> crops can't be cheesed. (v1.1.0 added Extended Bone Meal + Collective — sneak + a bone meal *item* to
> instant-grow.) **Every update requires everyone to re-download the matching client zip and replace their
> `mods` folder, or they can't join.**
>
> **Server-side extras (no client download needed):** the server also runs **Server-side Vein Miner
> & Tunneler** (`svmm`) — hold sneak + break an ore or log to vein-mine it (`/svmm enable` per player;
> toggle with `/svmm`). And island chests come pre-stocked with a **starter kit** — dirt×64,
> cobblestone×16, a crook, a string mesh, an **Oak Sieve**, and a **Wooden Hammer** — so the no-lava
> Ex Deorum loop works from the first minute with zero crafting:
>
> 1. **Place the Oak Sieve** from the chest.
> 2. **Right-click the sieve holding the string mesh** to load the mesh into it.
> 3. **Right-click the sieve holding dirt** to sift — this yields **Stone Pebbles** (consumes 1 dirt,
>    uses 1 mesh durability; the mesh eventually breaks and needs a new one).
> 4. **Craft 4 Stone Pebbles (2×2) → 1 Cobblestone.**
> 5. **Hold the Wooden Hammer and hit cobblestone** → Gravel (then Gravel → Sand → Dust, same way).
> 6. Compost leaves/saplings in a barrel for more dirt; sieve gravel/sand with better meshes
>    (Flint → Iron → Diamond → Netherite) for flint, ores, and Certus Quartz.
>
> There is **no cobble generator** — this sieve loop is the intended, fully renewable path.
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

## Licensing note

This pack bundles third-party mods. They remain under their respective authors' licenses;
all credit goes to the original mod authors. If you are a mod author and want your mod
removed from the distribution, open an issue.
