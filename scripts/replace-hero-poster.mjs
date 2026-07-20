import path from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  throw new Error("Pass the replacement poster image path as the first argument.");
}

const target = path.resolve("public/portfolio-assets/hero-poster-bubbles.webp");

await sharp(path.resolve(source))
  .rotate()
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 88, effort: 5, smartSubsample: true })
  .toFile(target);

const metadata = await sharp(target).metadata();
console.log(`Created ${path.relative(process.cwd(), target)} at ${metadata.width}x${metadata.height}.`);
