Add-Type -AssemblyName System.Drawing

$src = "E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png"
$img = [System.Drawing.Bitmap]::FromFile($src)

# Center of Option 2 Celestial Cradle in master image:
$cx = 638
$cy = 265
$maxRadius = 74 # strictly keep inside the circular emblem, excluding all outer card frames

$size = ($maxRadius * 2) + 4 # 152x152 square canvas
$half = [int]($size / 2)

# ==============================================================================
# 1. DARK MAROON EMBLEM (For Light Header Background)
# ==============================================================================
$darkBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $size; $x++) {
    for ($y = 0; $y -lt $size; $y++) {
        $dx = $x - $half
        $dy = $y - $half
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)

        if ($dist -gt $maxRadius) {
            # Outside circular emblem -> 100% transparent
            $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $srcX = $cx + $dx
            $srcY = $cy + $dy
            $c = $img.GetPixel($srcX, $srcY)
            $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)

            # Circular boundary feathering (anti-aliasing the outer perimeter)
            $edgeFactor = 1.0
            if ($dist -gt ($maxRadius - 2.0)) {
                $edgeFactor = [Math]::Max(0.0, [Math]::Min(1.0, ($maxRadius - $dist) / 2.0))
            }

            if ($lum -gt 210) {
                # Parchment / cream -> 100% transparent
                $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -gt 150) {
                # Smooth antialiased artwork strokes
                $alpha = [int](255 * (210 - $lum) / 60 * $edgeFactor)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                # Rich maroon stroke color
                $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                # Solid rich artwork stroke
                $alpha = [int](255 * $edgeFactor)
                $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            }
        }
    }
}

$darkPath = "E:\project\Apps\KidNamingApp\app\public\logo-transparent.png"
$darkBmp.Save($darkPath, [System.Drawing.Imaging.ImageFormat]::Png)
$darkBmp.Dispose()
Write-Host "Pristine dark transparent logo saved to: $darkPath"

# ==============================================================================
# 2. GLOWING CELESTIAL WHITE/GOLD EMBLEM (For Dark/Wine Banner Background)
# ==============================================================================
$whiteBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $size; $x++) {
    for ($y = 0; $y -lt $size; $y++) {
        $dx = $x - $half
        $dy = $y - $half
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)

        if ($dist -gt $maxRadius) {
            # Outside -> 100% transparent
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $srcX = $cx + $dx
            $srcY = $cy + $dy
            $c = $img.GetPixel($srcX, $srcY)
            $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)

            $edgeFactor = 1.0
            if ($dist -gt ($maxRadius - 2.0)) {
                $edgeFactor = [Math]::Max(0.0, [Math]::Min(1.0, ($maxRadius - $dist) / 2.0))
            }

            if ($lum -gt 210) {
                # Transparent background
                $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -gt 150) {
                # Antialiased glowing edge
                $alpha = [int](255 * (210 - $lum) / 60 * $edgeFactor)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                # Warm celestial ivory/gold
                $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 250, 235))
            } else {
                # Solid white stroke
                $alpha = [int](255 * $edgeFactor)
                $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
            }
        }
    }
}

$whitePath = "E:\project\Apps\KidNamingApp\app\public\logo-white-transparent.png"
$whiteBmp.Save($whitePath, [System.Drawing.Imaging.ImageFormat]::Png)
$whiteBmp.Dispose()
Write-Host "Pristine white transparent logo saved to: $whitePath"

$img.Dispose()

