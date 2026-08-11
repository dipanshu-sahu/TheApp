/**
 * Regenerates Android + iOS launcher icons from the full-bleed brand art.
 *
 * - No white background / nested plate
 * - Square assets = edge-to-edge square art
 * - Round assets = edge-to-edge circular art (true circle mask)
 * - Adaptive background matches the dark artwork so masks look seamless
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'assets/app-icon/source-fullbleed-1024.png');

const ANDROID_FG = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432,
};

const ANDROID_LEGACY = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const IOS_ICONS = [
  { file: 'Icon-20@2x.png', size: 40 },
  { file: 'Icon-20@3x.png', size: 60 },
  { file: 'Icon-29@2x.png', size: 58 },
  { file: 'Icon-29@3x.png', size: 87 },
  { file: 'Icon-40@2x.png', size: 80 },
  { file: 'Icon-40@3x.png', size: 120 },
  { file: 'Icon-60@2x.png', size: 120 },
  { file: 'Icon-60@3x.png', size: 180 },
  { file: 'Icon-1024.png', size: 1024 },
];

/** Square: full art, edge-to-edge. */
async function makeSquare(size) {
  return sharp(SOURCE).resize(size, size, { fit: 'cover' }).png().toBuffer();
}

/** Circle: full art covering the circle, hard circular mask — no white ring. */
async function makeCircle(size) {
  const art = await sharp(SOURCE).resize(size, size, { fit: 'cover' }).png().toBuffer();
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`,
  );
  return sharp(art)
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/**
 * Adaptive foreground: full art filling the layer.
 * Background color (#000831) matches the artwork so system masks look seamless.
 */
async function makeAdaptiveForeground(size) {
  return sharp(SOURCE).resize(size, size, { fit: 'cover' }).png().toBuffer();
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Missing source art: ${SOURCE}`);
  }

  for (const [folder, size] of Object.entries(ANDROID_FG)) {
    const out = path.join(
      ROOT,
      'android/app/src/main/res',
      folder,
      'ic_launcher_foreground.png',
    );
    await fs.promises.writeFile(out, await makeAdaptiveForeground(size));
    console.log('fg', folder, size);
  }

  for (const [folder, size] of Object.entries(ANDROID_LEGACY)) {
    const dir = path.join(ROOT, 'android/app/src/main/res', folder);
    await fs.promises.writeFile(path.join(dir, 'ic_launcher.png'), await makeSquare(size));
    await fs.promises.writeFile(path.join(dir, 'ic_launcher_round.png'), await makeCircle(size));
    console.log('legacy', folder, size);
  }

  const iosDir = path.join(ROOT, 'ios/TheApp/Images.xcassets/AppIcon.appiconset');
  for (const { file, size } of IOS_ICONS) {
    await fs.promises.writeFile(path.join(iosDir, file), await makeSquare(size));
    console.log('ios', file, size);
  }

  const outDir = path.join(ROOT, 'assets/app-icon');
  await fs.promises.mkdir(outDir, { recursive: true });
  await fs.promises.writeFile(path.join(outDir, 'icon-square-1024.png'), await makeSquare(1024));
  await fs.promises.writeFile(path.join(outDir, 'icon-circle-1024.png'), await makeCircle(1024));
  await fs.promises.writeFile(
    path.join(outDir, 'adaptive-foreground-1024.png'),
    await makeAdaptiveForeground(1024),
  );

  // Keep a convenience alias used by prior tooling
  await fs.promises.writeFile(path.join(outDir, 'icon-1024.png'), await makeSquare(1024));

  console.log('done');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
