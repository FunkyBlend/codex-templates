const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const svgPath = path.join(__dirname, 'src', 'app', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Create 512x512 social PNG in root
  const socialPngPath = path.join(__dirname, 'codexdepot-social-icon-512x512.png');
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(socialPngPath);
    
  // Create 180x180 apple-icon in src/app for iOS
  const appleIconPath = path.join(__dirname, 'src', 'app', 'apple-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleIconPath);

  // Optional: Create 32x32 favicon.ico just in case it's preferred
  const faviconPath = path.join(__dirname, 'src', 'app', 'icon.png');
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(faviconPath);

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
