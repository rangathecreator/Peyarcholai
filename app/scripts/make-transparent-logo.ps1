Add-Type -AssemblyName System.Drawing

$srcPath = "E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# Crop region helper that makes background transparent
function Create-Transparent-Cradle-Dark($x, $y, $w, $h, $destPath) {
    # This is for dark artwork (cradle on light background)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Now make background pixels transparent
    # The cradle is dark maroon (R < 130, G < 60, B < 70)
    for ($px = 0; $px -lt $w; $px++) {
        for ($py = 0; $py -lt $h; $py++) {
            $col = $bmp.GetPixel($px, $py)
            # If it's light background (cream/parchment), calculate lightness
            $lightness = ($col.R * 0.299 + $col.G * 0.587 + $col.B * 0.114)
            if ($lightness -gt 210) {
                $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lightness -gt 160) {
                # Smooth edge antialiasing
                $alpha = [int](255 * (210 - $lightness) / 50)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($alpha, $col.R, $col.G, $col.B))
            }
        }
    }

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created transparent light-bg logo: $destPath"
}

function Create-Transparent-Cradle-White($x, $y, $w, $h, $destPath) {
    # This is for white artwork on black background (from row 2, col 4)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    for ($px = 0; $px -lt $w; $px++) {
        for ($py = 0; $py -lt $h; $py++) {
            $col = $bmp.GetPixel($px, $py)
            $brightness = ($col.R * 0.299 + $col.G * 0.587 + $col.B * 0.114)
            if ($brightness -lt 40) {
                $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($brightness -lt 100) {
                $alpha = [int](255 * ($brightness - 40) / 60)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
            } else {
                # Make the art crisp pure white/ivory
                $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            }
        }
    }

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created transparent dark-bg logo: $destPath"
}

# 1. Header logo: Dark maroon cradle on transparent background
Create-Transparent-Cradle-Dark 525 165 230 185 "E:\project\Apps\KidNamingApp\app\public\logo-transparent.png"

# 2. Hero banner logo: Pure white cradle on transparent background (NO black box!)
Create-Transparent-Cradle-White 800 460 125 105 "E:\project\Apps\KidNamingApp\app\public\logo-white-transparent.png"

$img.Dispose()

