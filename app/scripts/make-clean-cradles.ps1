Add-Type -AssemblyName System.Drawing

$src = "E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png"
$img = [System.Drawing.Bitmap]::FromFile($src)

# Cradle bounding box: X=[559, 716], Y=[188, 345]
# Let's take X=548 to 728 (W=180), Y=178 to 346 (H=168)
$cropX = 548
$cropY = 178
$cropW = 180
$cropH = 168

# --- 1. DARK MAROON CRADLE (for light background like Header) ---
$darkBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($x = 0; $x -lt $cropW; $x++) {
    for ($y = 0; $y -lt $cropH; $y++) {
        $c = $img.GetPixel($cropX + $x, $cropY + $y)
        $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
        if ($lum -gt 210) {
            # Parchment background -> 100% transparent
            $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($lum -gt 155) {
            # Smooth antialiased border
            $alpha = [int](255 * (210 - $lum) / 55)
            $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
            $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            # Keep original rich artwork pixel
            $darkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
        }
    }
}
$darkPath = "E:\project\Apps\KidNamingApp\app\public\logo-transparent.png"
$darkBmp.Save($darkPath, [System.Drawing.Imaging.ImageFormat]::Png)
$darkBmp.Dispose()
Write-Host "Saved: $darkPath"

# --- 2. PURE WHITE/GOLD CRADLE (for dark banner background, ZERO black box) ---
$whiteBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($x = 0; $x -lt $cropW; $x++) {
    for ($y = 0; $y -lt $cropH; $y++) {
        $c = $img.GetPixel($cropX + $x, $cropY + $y)
        $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
        if ($lum -gt 210) {
            # Background -> transparent
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($lum -gt 155) {
            # Antialiased soft glow
            $alpha = [int](255 * (210 - $lum) / 55)
            $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 252, 245))
        } else {
            # Pure white
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        }
    }
}
$whitePath = "E:\project\Apps\KidNamingApp\app\public\logo-white-transparent.png"
$whiteBmp.Save($whitePath, [System.Drawing.Imaging.ImageFormat]::Png)
$whiteBmp.Dispose()
Write-Host "Saved: $whitePath"

$img.Dispose()
