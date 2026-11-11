Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png")
for ($y = 330; $y -le 355; $y += 5) {
    Write-Host "--- Y = $y ---"
    for ($x = 550; $x -le 725; $x += 5) {
        $c = $img.GetPixel($x, $y)
        $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
        if ($lum -lt 160) {
            Write-Host "  Dark at x=$x (lum=$lum, R=$($c.R), G=$($c.G), B=$($c.B))"
        }
    }
}
$img.Dispose()

