param(
  [string]$Url = "https://marketjoy.com/wp-content/uploads/2023/04/cropped-Logo.png",
  [string]$Out = ".\public\marketjoy-logo.png"
)
Add-Type -AssemblyName System.Drawing
$tmp = Join-Path $env:TEMP "mj-logo-src.png"
Invoke-WebRequest $Url -OutFile $tmp
$src = [System.Drawing.Bitmap]::FromFile($tmp)
$dst = New-Object System.Drawing.Bitmap $src.Width, $src.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $src.Height; $y++) {
  for ($x = 0; $x -lt $src.Width; $x++) {
    $p = $src.GetPixel($x, $y)
    $m = [Math]::Min($p.R, [Math]::Min($p.G, $p.B))
    $a = [Math]::Max(0, [Math]::Min(1, ((1 - $m / 255.0) - 0.04) / 0.96))
    if ($a -le 0) { $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255)); continue }
    $r = [int][Math]::Max(0, [Math]::Min(255, ($p.R - 255 * (1 - $a)) / $a))
    $g = [int][Math]::Max(0, [Math]::Min(255, ($p.G - 255 * (1 - $a)) / $a))
    $b = [int][Math]::Max(0, [Math]::Min(255, ($p.B - 255 * (1 - $a)) / $a))
    $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb([int]($a * 255), $r, $g, $b))
  }
}
$src.Dispose()
New-Item -ItemType Directory -Force (Split-Path $Out) | Out-Null
$dst.Save((Resolve-Path (Split-Path $Out)).Path + "\" + (Split-Path $Out -Leaf), [System.Drawing.Imaging.ImageFormat]::Png)
$dst.Dispose()
