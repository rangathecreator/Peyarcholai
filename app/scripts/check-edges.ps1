Add-Type -AssemblyName System.Drawing

function Check-File($path) {
    $b = [System.Drawing.Bitmap]::FromFile($path)
    $w = $b.Width
    $h = $b.Height
    $edges = 0
    for ($x = 0; $x -lt $w; $x++) {
        if ($b.GetPixel($x, 0).A -gt 0) { $edges++ }
        if ($b.GetPixel($x, $h - 1).A -gt 0) { $edges++ }
    }
    for ($y = 0; $y -lt $h; $y++) {
        if ($b.GetPixel(0, $y).A -gt 0) { $edges++ }
        if ($b.GetPixel($w - 1, $y).A -gt 0) { $edges++ }
    }
    Write-Host "$path : ${w}x${h}, non-zero edge pixels = $edges"
    $b.Dispose()
}

Check-File "E:\project\Apps\KidNamingApp\app\public\logo-transparent.png"
Check-File "E:\project\Apps\KidNamingApp\app\public\logo-white-transparent.png"

