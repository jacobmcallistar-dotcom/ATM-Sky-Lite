# ATM Sky Lite

A Minecraft **1.20.1 Forge** void-skyblock modpack (82 mods) built around Mekanism +
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
   - Your `mods` folder must contain **exactly** these 82 mods — remove any extras or you'll be kicked on join.

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

## Licensing note

This pack bundles third-party mods. They remain under their respective authors' licenses;
all credit goes to the original mod authors. If you are a mod author and want your mod
removed from the distribution, open an issue.
