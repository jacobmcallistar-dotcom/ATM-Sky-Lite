# -*- coding: utf-8 -*-
"""
Build the full client pack zip for Joshaay.

A FULL pack, not a delta: he is several versions behind (pre-Twilight-removal),
so a partial update would leave him with stale jars. In particular Inventory
Profiles Next and libIPN were REMOVED this build - a merge-style update would
leave them in place and mismatch the server, so INSTALL.txt tells him to
delete the old mods folder outright.

Zip entries are written with forward slashes explicitly; .NET/py zip on Windows
will otherwise emit backslashes that some extractors turn into flat filenames.
"""
import os, zipfile, io

CLIENT = r"C:\Users\jacob\AppData\Roaming\.minecraft"
SRV = r"C:\Users\jacob\Desktop\dogballs\server"
OUT = r"C:\Users\jacob\Desktop\ATM-Sky-Lite-v1.25.0-full.zip"

INSTALL = """========================================
  ATM SKY LITE  v1.25.0  -  Install Guide
  Minecraft 1.20.1  |  Forge 47.4.10
========================================

A void skyblock tech pack. Sieve your way up from a single tree, climb the
Create -> Mekanism -> AE2 -> Powah ladder, fly rockets to the Moon, Mars and
Venus with Ad Astra, raid Aether dungeons, and finish with the Heart of the Sky.

217 mods. The quest book (34 chapters) guides the whole run - open it with the
book in your inventory.

****************************************
  IMPORTANT - THIS IS A FULL REPLACEMENT
****************************************
Two mods were REMOVED this version (Inventory Profiles Next and libIPN). If you
just copy the new files over the top, those two will stay behind and the server
will refuse your connection.

DELETE your old mods folder completely before copying the new one in.

----------------------------------------
STEP 1 - Java
----------------------------------------
You need Java 17+. If you already play modded 1.20.1 you have it.
    https://adoptium.net/temurin/releases/?version=17

----------------------------------------
STEP 2 - Forge 47.4.10
----------------------------------------
Download the 1.20.1 Forge 47.4.10 installer:
    https://files.minecraftforge.net/net/minecraftforge/forge/index_1.20.1.html
Run it, choose "Install client", and let it finish.

The version MUST be 47.4.10. The pack moved up from 47.3.0 this release -
if you already had the pack, your old Forge will NOT work any more.

----------------------------------------
STEP 3 - Install the pack
----------------------------------------
Open your Minecraft folder:
    Windows key + R  ->  type  %appdata%\\.minecraft  ->  Enter

1. DELETE the existing "mods" folder entirely.
2. Copy the "mods" folder from this zip into .minecraft
3. Copy the "config" folder from this zip into .minecraft, replacing when asked.
4. Copy the "kubejs" folder from this zip into .minecraft, replacing when asked.
   This one is NOT optional - it registers custom items, and without it the
   server will drop you at login with a registry error.

----------------------------------------
STEP 4 - Give it enough RAM
----------------------------------------
In the Minecraft launcher: Installations -> your Forge 1.20.1 profile -> ...
-> Edit -> More Options -> JVM Arguments.

Change -Xmx2G to -Xmx6G  (6 GB). With 217 mods, 2 GB will freeze or crash on
join - this is the single most common cause of "I get kicked after ~20 seconds".

----------------------------------------
STEP 5 - Join
----------------------------------------
Launch the Forge 1.20.1 profile, then Multiplayer -> Add Server.
Ask Jacob for the current address.

----------------------------------------
IF IT STILL DISCONNECTS YOU
----------------------------------------
Send Jacob these two things:
  .minecraft\\logs\\latest.log
  .minecraft\\crash-reports\\  (the newest file, if any)

They say exactly what went wrong. Nine times out of ten it is RAM (Step 4).
"""


def add_tree(z, src_dir, arc_prefix, skip=()):
    """skip: exact dir names. Any dir containing '.bak' or 'backup' is dropped
    too - config/ftbquests holds several dated quest backups (including one
    named ...ftbq-damaged) that must never ship to a player."""
    n = 0
    for root, dirs, files in os.walk(src_dir):
        dirs[:] = [d for d in dirs
                   if d not in skip
                   and ".bak" not in d
                   and "backup" not in d.lower()]
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, src_dir).replace("\\", "/")
            z.write(full, "%s/%s" % (arc_prefix, rel))
            n += 1
    return n


with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    mods = add_tree(z, os.path.join(CLIENT, "mods"), "mods")
    cfg = 0
    for sub in ("ftbquests", "skyblockbuilder"):
        d = os.path.join(SRV, "config", sub)
        if os.path.isdir(d):
            cfg += add_tree(z, d, "config/" + sub, skip=("templates-backup-preclean",))
    # KubeJS scripts MUST ship. startup_scripts registers items (the nine Sky
    # Seals, Sky Matrix, Ascension Core, Celestial Core) - a client without
    # them cannot match the server's registry and is dropped at login with
    # "Unidentified mapping from registry minecraft:item". Earlier zips
    # shipped the KubeJS mod jars but none of the scripts.
    kjs = 0
    for sub in ("startup_scripts", "server_scripts"):
        d = os.path.join(SRV, "kubejs", sub)
        if os.path.isdir(d):
            kjs += add_tree(z, d, "kubejs/" + sub)
    z.writestr("INSTALL.txt", INSTALL)

size = os.path.getsize(OUT) / 1048576
print("built %s" % OUT)
print("  mods       : %d" % mods)
print("  config     : %d files" % cfg)
print("  kubejs     : %d scripts" % kjs)
print("  size       : %.1f MB" % size)

bad = [n for n in zipfile.ZipFile(OUT).namelist() if "\\" in n]
print("  backslash entries: %s" % (bad[:3] if bad else "none"))
