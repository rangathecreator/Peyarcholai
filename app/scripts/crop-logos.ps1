Add-Type -AssemblyName System.Drawing

$srcPath = "E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $destPath) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved $destPath ($w x $h)"
}

# 1. Clean Cosmic Cradle with "பெயர்" & Stars (Centered, zero text bleed)
Crop-Image 525 165 230 185 "E:\project\Apps\KidNamingApp\app\public\logo-cradle.png"

# 2. Minimal "பெ" in Cosmic Cradle (Row 2, Column 1, fully framed)
Crop-Image 105 455 115 120 "E:\project\Apps\KidNamingApp\app\public\logo-cradle-pe.png"

# 3. White / Dark Mode Cosmic Cradle (Row 2, Column 4)
Crop-Image 800 455 125 120 "E:\project\Apps\KidNamingApp\app\public\logo-cradle-white.png"

# 4. Web Banner (Top right card, cleanly framed)
Crop-Image 760 268 440 118 "E:\project\Apps\KidNamingApp\app\public\logo-banner.png"

$img.Dispose()
