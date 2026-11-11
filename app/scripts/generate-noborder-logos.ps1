Add-Type -AssemblyName System.Drawing

$src = "E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png"
$img = [System.Drawing.Bitmap]::FromFile($src)
$cx = 638
$cy = 265

# Without any ring (R <= 64):
$maxRadius = 64
$size = ($maxRadius * 2) + 4 # 132x132
$half = [int]($size / 2)

$darkNoBorder = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$whiteNoBorder = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $size; $x++) {
    for ($y = 0; $y -lt $size; $y++) {
        $dx = $x - $half
        $dy = $y - $half
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)

        if ($dist -gt $maxRadius) {
            $darkNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $whiteNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $srcX = $cx + $dx
            $srcY = $cy + $dy
            $c = $img.GetPixel($srcX, $srcY)
            $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)

            $edgeFactor = 1.0
            if ($dist -gt ($maxRadius - 3.0)) {
                $edgeFactor = [Math]::Max(0.0, [Math]::Min(1.0, ($maxRadius - $dist) / 3.0))
            }

            if ($lum -gt 205) {
                $darkNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                $whiteNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -gt 150) {
                $alpha = [int](255 * (205 - $lum) / 55 * $edgeFactor)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                $darkNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                $whiteNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 250, 235))
            } else {
                $alpha = [int](255 * $edgeFactor)
                $darkNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                $whiteNoBorder.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
            }
        }
    }
}

$darkNoBorder.Save("E:\project\Apps\KidNamingApp\app\public\logo-transparent-noborder.png", [System.Drawing.Imaging.ImageFormat]::Png)
$whiteNoBorder.Save("E:\project\Apps\KidNamingApp\app\public\logo-white-transparent-noborder.png", [System.Drawing.Imaging.ImageFormat]::Png)
$darkNoBorder.Dispose()
$whiteNoBorder.Dispose()
$img.Dispose()
Write-Host "Generated no-border variants!"

