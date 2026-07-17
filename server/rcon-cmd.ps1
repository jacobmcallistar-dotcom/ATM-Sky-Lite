param(
  [string]$Cmd = "stop",
  [string]$RconHost = "127.0.0.1",
  [int]$Port = 25575,
  [string]$Password = "CHANGEME_set_rcon.password_in_server.properties"
)
$ErrorActionPreference = "Stop"

function Send-Packet($stream, [int]$id, [int]$type, [string]$body) {
  $bodyBytes = [System.Text.Encoding]::ASCII.GetBytes($body)
  $len = 4 + 4 + $bodyBytes.Length + 2
  $ms = New-Object System.IO.MemoryStream
  $bw = New-Object System.IO.BinaryWriter($ms)
  $bw.Write([int]$len); $bw.Write([int]$id); $bw.Write([int]$type)
  $bw.Write($bodyBytes); $bw.Write([byte]0); $bw.Write([byte]0); $bw.Flush()
  $out = $ms.ToArray()
  $stream.Write($out, 0, $out.Length); $stream.Flush()
}

function Read-Packet($stream) {
  $lenBuf = New-Object byte[] 4
  if ($stream.Read($lenBuf, 0, 4) -lt 4) { return $null }
  $len = [BitConverter]::ToInt32($lenBuf, 0)
  $buf = New-Object byte[] $len
  $off = 0
  while ($off -lt $len) { $off += $stream.Read($buf, $off, $len - $off) }
  return @{
    id   = [BitConverter]::ToInt32($buf, 0)
    type = [BitConverter]::ToInt32($buf, 4)
    body = [System.Text.Encoding]::ASCII.GetString($buf, 8, $len - 10)
  }
}

try {
  $client = New-Object System.Net.Sockets.TcpClient
  $client.Connect($RconHost, $Port)
  $stream = $client.GetStream()
  Send-Packet $stream 1 3 $Password           # SERVERDATA_AUTH
  $auth = Read-Packet $stream
  if ($auth.id -eq -1) { Write-Error "RCON auth failed (wrong password?)"; exit 1 }
  Send-Packet $stream 2 2 $Cmd                 # SERVERDATA_EXECCOMMAND
  $resp = Read-Packet $stream
  if ($resp.body.Trim()) { Write-Host $resp.body.Trim() }
  Write-Host "Sent '$Cmd' via RCON."
  $client.Close()
}
catch {
  Write-Error "Could not reach RCON on ${RconHost}:${Port} - is the server running with enable-rcon=true? ($_)"
  exit 1
}
