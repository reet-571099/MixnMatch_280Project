import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../src/assets');

async function optimizeImages() {
  console.log('Optimizing images...');

  // Resize hero-cooking.webp from 1920x1080 to 896x504 (displayed size)
  await sharp(path.join(assetsDir, 'hero-cooking.webp'))
    .resize(896, 504, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(assetsDir, 'hero-cooking-896.webp'));
  console.log('Created hero-cooking-896.webp');

  // Also create a smaller version for mobile
  await sharp(path.join(assetsDir, 'hero-cooking.webp'))
    .resize(448, 252, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(assetsDir, 'hero-cooking-448.webp'));
  console.log('Created hero-cooking-448.webp');

  // Resize avatar images from 512x512 to 48x48 and 96x96 (for 2x displays)
  const avatars = ['avatar-sarah', 'avatar-james', 'avatar-emma'];

  for (const avatar of avatars) {
    // 48x48 for standard displays
    await sharp(path.join(assetsDir, `${avatar}.webp`))
      .resize(48, 48, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(assetsDir, `${avatar}-48.webp`));
    console.log(`Created ${avatar}-48.webp`);

    // 96x96 for 2x retina displays
    await sharp(path.join(assetsDir, `${avatar}.webp`))
      .resize(96, 96, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(assetsDir, `${avatar}-96.webp`));
    console.log(`Created ${avatar}-96.webp`);
  }

  console.log('Image optimization complete!');
}

optimizeImages().catch(console.error);
