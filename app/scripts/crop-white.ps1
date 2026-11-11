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

# White / Dark Mode Cosmic Cradle (Cleaned from text at bottom)
Crop-Image 800 460 125 105 "E:\project\Apps\KidNamingApp\app\public\logo-cradle-white.png"

$img.Dispose()

