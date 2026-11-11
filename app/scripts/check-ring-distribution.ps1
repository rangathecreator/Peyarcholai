Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png")
$cx = 638
$cy = 265

# Let us see what is inside radius 65 vs 75
Write-Host "Checking radius distribution of dark pixels"
for ($r = 10; $r -le 85; $r += 5) {
    $count = 0
    for ($dx = -$r; $dx -le $r; $dx++) {
        for ($dy = -$r; $dy -le $r; $dy++) {
            $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
            if ($dist -ge ($r - 2.5) -and $dist -lt ($r + 2.5)) {
                $c = $img.GetPixel($cx + $dx, $cy + $dy)
                $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
                if ($lum -lt 160) { $count++ }
            }
        }
    }
    Write-Host "Ring around r=$r : $count dark pixels"
}
$img.Dispose()

