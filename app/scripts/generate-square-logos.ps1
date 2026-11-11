Add-Type -AssemblyName System.Drawing

$src = "E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png"
$img = [System.Drawing.Bitmap]::FromFile($src)

$cx = 638
$cy = 265
$halfSide = 80 # 160x160 square emblem
$size = $halfSide * 2

Write-Host "Creating square 160x160 logo without circular cropping..."

$darkSquare = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$whiteSquare = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $size; $x++) {
    for ($y = 0; $y -lt $size; $y++) {
        $dx = $x - $halfSide
        $dy = $y - $halfSide
        
        $srcX = $cx + $dx
        $srcY = $cy + $dy
        
        if ($srcX -ge 0 -and $srcX -lt $img.Width -and $srcY -ge 0 -and $srcY -lt $img.Height) {
            $c = $img.GetPixel($srcX, $srcY)
            $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
            
            # Key out the outer cream / parchment background (lum > 210)
            if ($lum -gt 212) {
                # 100% transparent background
                $darkSquare.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                $whiteSquare.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -gt 160) {
                # Antialiased edge
                $alpha = [int](255 * (212 - $lum) / 52)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                
                $darkSquare.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                $whiteSquare.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 250, 235))
            } else {
                # Solid stroke
                $darkSquare.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
                $whiteSquare.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            }
        }
    }
}

$darkSquare.Save("E:\project\Apps\KidNamingApp\app\public\logo-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$whiteSquare.Save("E:\project\Apps\KidNamingApp\app\public\logo-white-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)

$darkSquare.Dispose()
$whiteSquare.Dispose()
$img.Dispose()

Write-Host "Successfully generated square logos in app/public/logo-transparent.png and logo-white-transparent.png"

