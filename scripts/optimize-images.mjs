import { readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetsRoot = path.resolve("public/portfolio-assets");
const staticPattern = /\.(?:png|jpe?g)$/i;
const animatedPattern = /\.gif$/i;
const concurrency = 2;

sharp.cache(false);
sharp.concurrency(concurrency);

async function removeSource(source) {
  await rm(source, {
    force: true,
    maxRetries: 10,
    retryDelay: 200,
  });
}

async function collectFiles(directory) {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(directory, entry);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      files.push(...(await collectFiles(filePath)));
    } else if (staticPattern.test(entry) || animatedPattern.test(entry)) {
      files.push(filePath);
    }
  }

  return files;
}

async function writeImageManifest() {
  const optimizedFiles = [];

  async function collect(directory) {
    for (const entry of await readdir(directory)) {
      const filePath = path.join(directory, entry);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        await collect(filePath);
      } else if (/\.webp$/i.test(entry) && !/motion-\d+\.webp$/i.test(entry)) {
        optimizedFiles.push(filePath);
      }
    }
  }

  await collect(assetsRoot);

  const manifest = {};
  for (const filePath of optimizedFiles) {
    const metadata = await sharp(filePath).metadata();
    const publicPath = `/portfolio-assets/${path
      .relative(assetsRoot, filePath)
      .replaceAll(path.sep, "/")}`;

    manifest[publicPath] = {
      width: metadata.width,
      height: metadata.pageHeight ?? metadata.height,
    };
  }

  const manifestPath = path.resolve("components/ui/image-manifest.json");
  await writeFile(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  console.log(`Wrote ${optimizedFiles.length} entries to ${manifestPath}`);
}

async function optimizeStatic(source) {
  const base = source.replace(staticPattern, "");
  const avifPath = `${base}.avif`;
  const webpPath = `${base}.webp`;
  const sourceMetadata = await sharp(source).metadata();

  await sharp(source)
    .avif({
      quality: 90,
      effort: 3,
      chromaSubsampling: "4:4:4",
    })
    .toFile(avifPath);

  await sharp(source)
    .webp({
      quality: 92,
      alphaQuality: 100,
      smartSubsample: true,
      effort: 3,
    })
    .toFile(webpPath);

  const [avifMetadata, webpMetadata] = await Promise.all([
    sharp(avifPath).metadata(),
    sharp(webpPath).metadata(),
  ]);

  for (const metadata of [avifMetadata, webpMetadata]) {
    if (
      metadata.width !== sourceMetadata.width ||
      metadata.height !== sourceMetadata.height
    ) {
      throw new Error(`Image dimensions changed while optimizing ${source}`);
    }
  }

  await removeSource(source);
}

async function optimizeAnimated(source) {
  const webpPath = source.replace(animatedPattern, ".webp");
  const sourceMetadata = await sharp(source, { animated: true }).metadata();

  await sharp(source, { animated: true })
    .webp({
      quality: 92,
      alphaQuality: 100,
      smartSubsample: true,
      effort: 3,
      loop: 0,
    })
    .toFile(webpPath);

  const webpMetadata = await sharp(webpPath, { animated: true }).metadata();
  const sourceDuration = sourceMetadata.delay?.reduce(
    (total, delay) => total + delay,
    0,
  );
  const webpDuration = webpMetadata.delay?.reduce(
    (total, delay) => total + delay,
    0,
  );
  if (
    webpMetadata.width !== sourceMetadata.width ||
    webpMetadata.pageHeight !== sourceMetadata.pageHeight ||
    webpDuration !== sourceDuration
  ) {
    throw new Error(`Animation metadata changed while optimizing ${source}`);
  }

  await removeSource(source);
}

const files = await collectFiles(assetsRoot);
let nextIndex = 0;
let completed = 0;

async function worker() {
  while (nextIndex < files.length) {
    const source = files[nextIndex];
    nextIndex += 1;

    if (animatedPattern.test(source)) {
      await optimizeAnimated(source);
    } else {
      await optimizeStatic(source);
    }

    completed += 1;
    console.log(`[${completed}/${files.length}] ${path.relative(assetsRoot, source)}`);
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, files.length) }, () => worker()),
);

console.log(`Optimized ${files.length} source images.`);
await writeImageManifest();
