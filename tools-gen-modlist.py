# Generate a tracked MODLIST.md from the live server's mods folder.
#
# WHY: mods/ and *.jar are gitignored, so the actual mod set has never been in
# version control. The only list in the repo is manifest.json, a placeholder
# with 17 entries and fileID "LATEST" that cannot install anything. That means
# mod additions and removals - four removed in the Powah/RS cleanup, two AE2
# addons added since - leave no trace at all.
#
# A plain text list is diffable, costs nothing, and makes "what changed" answer
# itself next time.

import os, io, datetime, sys

SRV = r"C:\Users\jacob\Desktop\dogballs\server\mods"
CLI = r"C:\Users\jacob\AppData\Roaming\.minecraft\mods"
OUT = r"C:\Users\jacob\Desktop\ATM-Sky-Lite\MODLIST.md"

# stamped by the caller - Date.now() equivalents are avoided in scripts, but
# this is a plain python run so a real timestamp is fine
stamp = sys.argv[1] if len(sys.argv) > 1 else "unknown"

srv = sorted(f for f in os.listdir(SRV) if f.endswith(".jar"))
cli = sorted(f for f in os.listdir(CLI) if f.endswith(".jar")) if os.path.isdir(CLI) else []

only_client = [f for f in cli if f not in srv]
only_server = [f for f in srv if f not in cli]

lines = []
lines.append("# ATM Sky Lite - mod list")
lines.append("")
lines.append("Generated from the live server's `mods/` folder. Jars themselves are")
lines.append("gitignored (they live in Releases), so this file is the only record in")
lines.append("version control of what the pack actually contains.")
lines.append("")
lines.append("Regenerate with `tools-gen-modlist.py` after any mod change, so additions")
lines.append("and removals show up in the diff.")
lines.append("")
lines.append("| | count |")
lines.append("|---|---|")
lines.append("| server | %d |" % len(srv))
lines.append("| client | %d |" % len(cli))
lines.append("")
lines.append("Last generated: %s" % stamp)
lines.append("")

if only_client:
    lines.append("## Client-only")
    lines.append("")
    lines.append("Legitimate client-side extras. Anything else appearing here is a sync bug -")
    lines.append("a client with mods the server lacks is dropped at login with a mod channel")
    lines.append("mismatch.")
    lines.append("")
    for f in only_client:
        lines.append("- `%s`" % f)
    lines.append("")

if only_server:
    lines.append("## Server-only")
    lines.append("")
    for f in only_server:
        lines.append("- `%s`" % f)
    lines.append("")

lines.append("## All mods (server)")
lines.append("")
for f in srv:
    lines.append("- `%s`" % f)
lines.append("")

with io.open(OUT, "w", encoding="utf-8", newline="\n") as fh:
    fh.write("\n".join(lines))

print("wrote %s" % OUT)
print("  server jars : %d" % len(srv))
print("  client jars : %d" % len(cli))
print("  client-only : %s" % (only_client or "none"))
print("  server-only : %s" % (only_server or "none"))
