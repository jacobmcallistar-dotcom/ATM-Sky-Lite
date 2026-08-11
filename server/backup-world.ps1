<#
  ATM Sky Lite - world backup with rotation.

  Takes a consistent snapshot of the world while the server is RUNNING, then
  prunes old backups so this can never fill the disk.

  Consistency: Minecraft buffers chunk writes, so copying the world folder from
  under a live server can capture a half-written region. The fix is the standard
  hot-backup dance:

      save-off        stop the server writing to disk
      save-all flush  force everything currently buffered out to disk
      <copy>          world on disk is now static and complete
      save-on         resume normal saving

  save-on is in a finally block. If anything in the middle throws, saving is
  still turned back on - a server left with save-off silently stops persisting
  anything, which is far worse than a failed backup.

  If the server is not running, it just copies straight from disk.

  Rotation - three independent limits, whichever bites first:
      -KeepCount   maximum number of backups to retain      (default 24)
      -MaxTotalGB  maximum total size of the backup folder  (default 10)
      -MinFreeGB   free space on the drive to preserve      (default 50)

  The newest backup is NEVER deleted, even if it alone breaches a limit.

  Usage:
      powershell -ExecutionPolicy Bypass -File backup-world.ps1
      powershell -ExecutionPolicy Bypass -File backup-world.ps1 -KeepCount 48 -MaxTotalGB 20
#>

[CmdletBinding()]
param(
    [int]    $KeepCount  = 24,
    [double] $MaxTotalGB = 10,
    [double] $MinFreeGB  = 50,
    [string] $BackupDir  = 'C:\Users\jacob\Desktop\dogballs\server-backups',
    [string] $ServerDir  = 'C:\Users\jacob\Desktop\dogballs\server'
)

$ErrorActionPreference = 'Stop'

$WorldDir = Join-Path $ServerDir 'world'
$RconCmd  = Join-Path $ServerDir 'rcon-cmd.ps1'
$LogFile  = Join-Path $BackupDir 'backup.log'

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $line = '{0} [{1}] {2}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Level, $Message
    Write-Output $line
    try { Add-Content -Path $LogFile -Value $line -Encoding utf8 } catch { }
}

function Test-ServerRunning {
    [bool](Get-Process java -ErrorAction SilentlyContinue)
}

function Invoke-Rcon {
    param([string]$Command)
    # Best-effort: a failed RCON call must not abort the backup, but save-off
    # failing DOES matter - the caller checks the return value.
    try {
        & $RconCmd $Command *> $null
        return $true
    } catch {
        Write-Log "RCON '$Command' failed: $_" 'WARN'
        return $false
    }
}

# --------------------------------------------------------------------------
# Prune old backups. Called AFTER a successful backup so a failed run never
# deletes anything, and the just-made backup is counted against the limits.
# --------------------------------------------------------------------------
function Invoke-Rotation {
    $backups = @(Get-ChildItem $BackupDir -Filter 'auto-world-*.zip' -File -ErrorAction SilentlyContinue |
                 Sort-Object LastWriteTime -Descending)

    if ($backups.Count -eq 0) { return }

    $deleted = 0
    $reasons = @{}

    # Pass 1 - count limit
    if ($backups.Count -gt $KeepCount) {
        foreach ($b in $backups[$KeepCount..($backups.Count - 1)]) {
            $reasons[$b.Name] = "count > $KeepCount"
        }
    }

    # Pass 2 - total-size limit. Walk newest -> oldest, keeping a running total.
    $running = 0
    foreach ($b in $backups) {
        $running += $b.Length
        if ($running -gt ($MaxTotalGB * 1GB) -and -not $reasons.ContainsKey($b.Name)) {
            $reasons[$b.Name] = "total > $MaxTotalGB GB"
        }
    }

    # Pass 3 - free-space floor. Delete oldest first until the drive has room.
    $free = (Get-PSDrive C).Free
    if ($free -lt ($MinFreeGB * 1GB)) {
        $need = ($MinFreeGB * 1GB) - $free
        $recovered = 0
        for ($i = $backups.Count - 1; $i -ge 1 -and $recovered -lt $need; $i--) {
            if (-not $reasons.ContainsKey($backups[$i].Name)) {
                $reasons[$backups[$i].Name] = "free < $MinFreeGB GB"
            }
            $recovered += $backups[$i].Length
        }
    }

    # NEVER delete the newest backup, whatever the limits say.
    $newest = $backups[0].Name
    if ($reasons.ContainsKey($newest)) {
        $reasons.Remove($newest)
        Write-Log "Newest backup $newest breaches a limit but is retained (never delete the only copy)." 'WARN'
    }

    foreach ($name in $reasons.Keys) {
        try {
            Remove-Item (Join-Path $BackupDir $name) -Force
            Write-Log "pruned $name  ($($reasons[$name]))"
            $deleted++
        } catch {
            Write-Log "could not prune ${name}: $_" 'WARN'
        }
    }

    if ($deleted -eq 0) { Write-Log 'rotation: nothing to prune' }
}

# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}
if (-not (Test-Path $WorldDir)) {
    Write-Log "world folder not found at $WorldDir - aborting." 'ERROR'
    exit 1
}

# The "auto-" prefix is load-bearing. The backup folder ALSO holds hand-made
# milestone snapshots (server-backup-*.zip, world-backup-*-pre-automation.zip,
# *-PRE-GATING.zip). Rotation only ever matches auto-world-*.zip, so it can
# never delete one of those. Do not loosen this filter.
$stamp   = Get-Date -Format 'yyyyMMdd-HHmmss'
$zipPath = Join-Path $BackupDir "auto-world-$stamp.zip"
$staging = Join-Path $env:TEMP "atm-backup-$stamp"

$running    = Test-ServerRunning
$saveWasOff = $false

Write-Log "backup starting (server $(if ($running) { 'RUNNING - hot backup' } else { 'stopped - cold backup' }))"

try {
    if ($running) {
        if (Invoke-Rcon 'save-off') { $saveWasOff = $true }
        Invoke-Rcon 'save-all flush' | Out-Null
        Start-Sleep -Seconds 5   # let the flush finish before we read the files
    }

    # Stage with robocopy: it tolerates files the server still holds open,
    # which a plain Compress-Archive of a live world does not.
    #   /MIR mirror  /R:2 retries  /W:1 wait  /NFL /NDL /NJH /NJS quiet  /MT:4 threads
    #
    # session.lock is excluded deliberately. The server holds an EXCLUSIVE lock on
    # it for its entire runtime, so it can never be copied hot - and it must not be
    # in a backup anyway, since it is just a "this world is open" marker that gets
    # recreated on load. Restoring one would be actively wrong.
    #
    # Robocopy exit codes are a bitmask: <8 is success (1=copied, 2=extras,
    # 4=mismatched), >=8 means files genuinely failed to copy.
    $null = robocopy $WorldDir $staging /MIR /XF session.lock /R:2 /W:1 /NFL /NDL /NJH /NJS /MT:4
    if ($LASTEXITCODE -ge 8) {
        throw "robocopy failed with exit code $LASTEXITCODE"
    }
}
finally {
    # Always re-enable saving, even if staging blew up.
    if ($saveWasOff) {
        if (Invoke-Rcon 'save-on') {
            Write-Log 'save-on restored'
        } else {
            Write-Log 'FAILED to restore save-on - run "save-on" manually via RCON NOW.' 'ERROR'
        }
    }
}

try {
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    # Entries are written by hand rather than with CreateFromDirectory because
    # .NET Framework (which Windows PowerShell 5.1 uses) writes the OS separator
    # into entry names - producing "DIM-1\region\r.0.0.mca". The ZIP spec calls
    # for forward slashes, and extractors that follow it treat a backslash as a
    # literal character, giving one flat file with a weird name instead of a
    # directory tree. That would make the backup useless on restore.
    $zip = [System.IO.Compression.ZipFile]::Open(
        $zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $base = (Resolve-Path $staging).Path.TrimEnd('\') + '\'
        foreach ($file in Get-ChildItem $staging -Recurse -File -Force) {
            $rel = $file.FullName.Substring($base.Length).Replace('\', '/')
            $null = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip, $file.FullName, $rel,
                [System.IO.Compression.CompressionLevel]::Optimal)
        }
    }
    finally {
        $zip.Dispose()
    }

    $sizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
    Write-Log "created auto-world-$stamp.zip ($sizeMB MB)"
}
catch {
    Write-Log "zip failed: $_" 'ERROR'
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force -ErrorAction SilentlyContinue }
    if (Test-Path $staging) { Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue }
    exit 1
}
finally {
    if (Test-Path $staging) { Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue }
}

Invoke-Rotation

$all   = @(Get-ChildItem $BackupDir -Filter 'auto-world-*.zip' -File -ErrorAction SilentlyContinue)
$total = [math]::Round((($all | Measure-Object Length -Sum).Sum) / 1GB, 2)
$free  = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
Write-Log "done - $($all.Count) backups, $total GB used, $free GB free on C:"

# Explicit success. Without this the script inherits robocopy's exit code (1 =
# "files copied", a SUCCESS in robocopy's bitmask), which Task Scheduler would
# otherwise report as a failed run.
exit 0
