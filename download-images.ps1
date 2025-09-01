# PowerShell script to download placeholder images for the website
# Run this script in the images/ directory to download all required images

$images = @{
    # Website template images (400x300)
    "website-1.jpg" = "https://picsum.photos/400/300?random=1"
    "website-2.jpg" = "https://picsum.photos/400/300?random=2"
    "website-3.jpg" = "https://picsum.photos/400/300?random=3"
    "website-4.jpg" = "https://picsum.photos/400/300?random=4"
    "website-5.jpg" = "https://picsum.photos/400/300?random=5"
    "website-6.jpg" = "https://picsum.photos/400/300?random=6"
    "website-7.jpg" = "https://picsum.photos/400/300?random=7"
    "website-8.jpg" = "https://picsum.photos/400/300?random=8"
    "website-9.jpg" = "https://picsum.photos/400/300?random=9"
    "website-10.jpg" = "https://picsum.photos/400/300?random=10"

    # Bundle hero image (800x600)
    "bundle-hero.jpg" = "https://picsum.photos/800/600?random=11"

    # Course images (400x250)
    "course-html.jpg" = "https://picsum.photos/400/250?random=12"
    "course-js.jpg" = "https://picsum.photos/400/250?random=13"
    "course-react.jpg" = "https://picsum.photos/400/250?random=14"

    # Avatar images (60x60)
    "avatar-1.jpg" = "https://picsum.photos/60/60?random=15"
    "avatar-2.jpg" = "https://picsum.photos/60/60?random=16"
    "avatar-3.jpg" = "https://picsum.photos/60/60?random=17"
    "avatar-4.jpg" = "https://picsum.photos/60/60?random=18"
    "avatar-5.jpg" = "https://picsum.photos/60/60?random=19"
    "avatar-6.jpg" = "https://picsum.photos/60/60?random=20"
}

Write-Host "Downloading placeholder images..." -ForegroundColor Green

foreach ($image in $images.GetEnumerator()) {
    $fileName = $image.Key
    $url = $image.Value

    Write-Host "Downloading $fileName..." -ForegroundColor Yellow

    try {
        Invoke-WebRequest -Uri $url -OutFile $fileName -ErrorAction Stop
        Write-Host "✓ Downloaded $fileName" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to download $fileName" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Image download complete!" -ForegroundColor Green
Write-Host "Note: These are placeholder images from Picsum.photos" -ForegroundColor Cyan
Write-Host "For production, replace with your actual website screenshots and photos." -ForegroundColor Cyan
