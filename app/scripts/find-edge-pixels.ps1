Add-Type -AssemblyName System.Drawing

$b = [System.Drawing.Bitmap]::FromFile("E:\project\Apps\KidNamingApp\app\public\logo-transparent.png")
$w = $b.Width
$h = $b.Height

for ($x = 0; $x -lt $w; $x++) {
    if ($b.GetPixel($x, 0).A -gt 0) { Write-Host "Top at x=$x (A=$($b.GetPixel($x, 0).A))" }
    if ($b.GetPixel($x, $h - 1).A -gt 0) { Write-Host "Bottom at x=$x (A=$($b.GetPixel($x, $h - 1).A))" }
}
for ($y = 0; $y -lt $h; $y++) {
    if ($b.GetPixel(0, $y).A -gt 0) { Write-Host "Left at y=$y" }
    if ($b.GetPixel($w - 1, $y).A -gt 0) { Write-Host "Right at y=$y" }
}
$b.Dispose()

