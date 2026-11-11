Add-Type -AssemblyName System.Drawing
function BoundingBox($path) {
    $b = [System.Drawing.Bitmap]::FromFile($path)
    $minX = $b.Width; $maxX = 0; $minY = $b.Height; $maxY = 0;
    for ($y=0; $y -lt $b.Height; $y++) {
        for ($x=0; $x -lt $b.Width; $x++) {
            if ($b.GetPixel($x, $y).A -gt 20) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    Write-Host "$path : Size=$($b.Width)x$($b.Height), Bounds: X=[$minX, $maxX], Y=[$minY, $maxY], Art size: $($maxX - $minX + 1) x $($maxY - $minY + 1)"
    $b.Dispose()
}
BoundingBox "E:\project\Apps\KidNamingApp\app\public\logo-transparent-noborder.png"
BoundingBox "E:\project\Apps\KidNamingApp\app\public\logo-white-transparent-noborder.png"

