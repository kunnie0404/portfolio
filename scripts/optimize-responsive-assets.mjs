import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = path.resolve("dist/client/portfolio-assets");
const assetsRoot = path.resolve("public/portfolio-assets");
const manifestPath = path.resolve("components/ui/image-manifest.json");
const fullWidth = 2560;
const responsiveWidth = 1280;

sharp.cache(false);
sharp.concurrency(4);

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

async function encode(source, target, width, format) {
  const pipeline = sharp(source).resize({ width, withoutEnlargement: true });

  if (format === "avif") {
    await pipeline
      .avif({
        quality: width === fullWidth ? 82 : 78,
        effort: 3,
        chromaSubsampling: "4:4:4",
      })
      .toFile(target);
    return;
  }

  await pipeline
    .webp({
      quality: width === fullWidth ? 87 : 82,
      effort: 3,
      smartSubsample: true,
    })
    .toFile(target);
}

const sourceFiles = await collect(sourceRoot);
const workSources = sourceFiles.filter((file) => {
  const relative = path.relative(sourceRoot, file).replaceAll(path.sep, "/");
  return (
    /\.png$/i.test(file) &&
    (relative.startsWith("projects/") || /^cover-[^/]+\.png$/i.test(relative))
  );
});

const jobs = [];
for (const source of workSources) {
  const relative = path.relative(sourceRoot, source);
  const baseTarget = path.join(assetsRoot, relative).replace(/\.png$/i, "");

  for (const format of ["avif", "webp"]) {
    jobs.push(() => encode(source, `${baseTarget}.${format}`, fullWidth, format));
    jobs.push(() => encode(source, `${baseTarget}.1280.${format}`, responsiveWidth, format));
  }
}

let nextJob = 0;
async function worker() {
  while (nextJob < jobs.length) {
    const job = jobs[nextJob];
    nextJob += 1;
    await job();
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));

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
console.log(`Generated ${jobs.length} optimized WORK images from ${workSources.length} original PNG files.`);
