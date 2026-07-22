import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const sourceUrl = new URL("../reference-dino-preview.html", import.meta.url);
const outputUrl = new URL("../public/portfolio-home.html", import.meta.url);
const envUrls = [
  new URL("../.env.local", import.meta.url),
  new URL("../.env.production", import.meta.url),
];

const source = await readFile(sourceUrl, "utf8");
let configuredAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

for (const envUrl of envUrls) {
  if (configuredAssetBaseUrl) {
    break;
  }

  try {
    const envFile = await readFile(envUrl, "utf8");
    const assetBaseUrlEntry = envFile.match(
      /^NEXT_PUBLIC_ASSET_BASE_URL\s*=\s*(.+)$/m,
    );
    configuredAssetBaseUrl = assetBaseUrlEntry?.[1]
      .trim()
      .replace(/^['"]|['"]$/g, "");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

const assetBaseUrl = (configuredAssetBaseUrl ?? "").replace(
  /\/+$/,
  "",
);
const normalizedSource = source
  .replaceAll('"public/', '"/')
  .replaceAll("public/portfolio-assets/", "/portfolio-assets/");
const output = assetBaseUrl
  ? normalizedSource.replaceAll(
      "/portfolio-assets/",
      `${assetBaseUrl}/portfolio-assets/`,
    )
  : normalizedSource;

if (output.includes("public/portfolio-assets/")) {
  throw new Error("The generated homepage still contains invalid public asset URLs.");
}

await writeFile(outputUrl, output, "utf8");

console.log(`Generated ${fileURLToPath(outputUrl)}`);
