Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png")
# Let us inspect the geometry of Option 2 between x=550..725, y=170..360
# Option 2 center is approximately x=638, y=265
$cx = 638
$cy = 265
Write-Host "Option 2 center approx: ($cx, $cy)"

# Check pixels along circle of radius r
for ($r = 50; $r -le 85; $r += 5) {
    $darkOnCircle = 0
    for ($deg = 0; $deg -lt 360; $deg += 10) {
        $rad = [Math]::PI * $deg / 180.0
        $px = [int]($cx + $r * [Math]::Cos($rad))
        $py = [int]($cy + $r * [Math]::Sin($rad))
        if ($px -ge 0 -and $px -lt $img.Width -and $py -ge 0 -and $py -lt $img.Height) {
            $c = $img.GetPixel($px, $py)
            $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
            if ($lum -lt 150) { $darkOnCircle++ }
        }
    }
    Write-Host "Radius $r : dark points = $darkOnCircle / 36"
}
$img.Dispose()

