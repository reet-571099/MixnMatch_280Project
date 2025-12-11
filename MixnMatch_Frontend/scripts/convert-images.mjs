import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, parse } from 'path';

const ASSETS_DIR = './src/assets';
const QUALITY = 80; // WebP quality (0-100)

async function convertImages() {
  console.log('Starting image conversion to WebP...\n');

  const files = await readdir(ASSETS_DIR);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.png'));

  let totalSaved = 0;

  for (const file of jpgFiles) {
    const inputPath = join(ASSETS_DIR, file);
    const { name } = parse(file);
    const outputPath = join(ASSETS_DIR, `${name}.webp`);

    try {
      const inputStats = await stat(inputPath);
      const inputSize = inputStats.size;

      // Convert to WebP with quality setting
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const outputStats = await stat(outputPath);
      const outputSize = outputStats.size;
      const saved = inputSize - outputSize;
      const percent = ((saved / inputSize) * 100).toFixed(1);

      totalSaved += saved;

      console.log(`✓ ${file}`);
      console.log(`  ${(inputSize / 1024).toFixed(1)} KB → ${(outputSize / 1024).toFixed(1)} KB (saved ${percent}%)\n`);
    } catch (err) {
      console.error(`✗ Error converting ${file}:`, err.message);
    }
  }

  console.log('================================');
  console.log(`Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log('================================');
  console.log('\nDone! WebP files created alongside originals.');
  console.log('Update your imports to use .webp extension.');
}

convertImages().catch(console.error);
