Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile("src\assets\app_icon.jpg")
$image.Save("src\assets\temp_icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
