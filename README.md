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

> **Updating from v1.0.0?** v1.1.0 adds two mods (**Extended Bone Meal** + its **Collective** library —
> crouch/sneak + bone meal to instantly grow crops). Everyone must re-download the v1.1.0 client zip and
> replace their `mods` folder, or they can't join. (Mystical Agriculture crops still ignore bone meal by design.)
4. Launch with the Forge 1.20.1 profile and connect to the server address.

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
