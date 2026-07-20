import { readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetsRoot = path.resolve("public/portfolio-assets");
const manifestPath = path.resolve("components/ui/image-manifest.json");
const maxWidth = 2560;
const responsiveWidth = 1280;

sharp.cache(false);
sharp.concurrency(2);

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory)) {
    const filePath = path.join(directory, entry);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) files.push(...(await collect(filePath)));
    else files.push(filePath);
  }
  return files;
}

async function replaceWithResized(source, width, format) {
  const temporary = `${source}.responsive-tmp`;
  const pipeline = sharp(source).resize({ width, withoutEnlargement: true });

  if (format === "avif") {
    await pipeline.avif({ quality: 86, effort: 4, chromaSubsampling: "4:4:4" }).toFile(temporary);
  } else {
    await pipeline.webp({ quality: 90, effort: 4, smartSubsample: true }).toFile(temporary);
  }

  await rm(source, { force: true });
  await rename(temporary, source);
}

async function createVariant(source, target, format) {
  const pipeline = sharp(source).resize({ width: responsiveWidth, withoutEnlargement: true });
  if (format === "avif") {
    await pipeline.avif({ quality: 80, effort: 4, chromaSubsampling: "4:4:4" }).toFile(target);
  } else {
    await pipeline.webp({ quality: 84, effort: 4, smartSubsample: true }).toFile(target);
  }
}

const allFiles = await collect(assetsRoot);
const sources = allFiles.filter(
  (file) => /\.(?:avif|webp)$/i.test(file) && !/\.1280\.(?:avif|webp)$/i.test(file) && !/motion-\d+\.webp$/i.test(file),
);

let optimized = 0;
let variants = 0;
for (const source of sources) {
  const metadata = await sharp(source).metadata();
  if (!metadata.width || (metadata.pages ?? 1) > 1 || metadata.width <= responsiveWidth) continue;

  const format = path.extname(source).slice(1).toLowerCase();
  if (metadata.width > maxWidth) {
    await replaceWithResized(source, maxWidth, format);
    optimized += 1;
  }

  const variant = source.replace(/\.(avif|webp)$/i, `.1280.$1`);
  await createVariant(source, variant, format);
  variants += 1;
}

const manifest = {};
for (const filePath of await collect(assetsRoot)) {
  if (!/\.webp$/i.test(filePath) || /motion-\d+\.webp$/i.test(filePath)) continue;
  const metadata = await sharp(filePath).metadata();
  const publicPath = `/portfolio-assets/${path.relative(assetsRoot, filePath).replaceAll(path.sep, "/")}`;
  manifest[publicPath] = {
    width: metadata.width,
    height: metadata.pageHeight ?? metadata.height,
  };
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Resized ${optimized} large files and generated ${variants} responsive variants.`);
