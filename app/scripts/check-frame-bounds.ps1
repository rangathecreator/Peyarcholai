Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("E:\project\Apps\KidNamingApp\images\reference\Gemini_Generated_Image_gbstp6gbstp6gbst.png")
for ($y = 190; $y -le 330; $y += 20) {
    Write-Host "--- Y = $y ---"
    $hits = @()
    for ($x = 550; $x -le 725; $x++) {
        $c = $img.GetPixel($x, $y)
        $lum = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
        if ($lum -lt 160) {
            $hits += $x
        }
    }
    Write-Host "  MinX=$($hits[0]), MaxX=$($hits[-1]), Count=$($hits.Count)"
}
$img.Dispose()

