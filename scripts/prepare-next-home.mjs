import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const sourceUrl = new URL("../reference-dino-preview.html", import.meta.url);
const outputUrl = new URL("../public/portfolio-home.html", import.meta.url);

const source = await readFile(sourceUrl, "utf8");
const output = source.replaceAll('"public/', '"/');

if (output.includes('"public/')) {
  throw new Error("The generated homepage still contains public/ asset URLs.");
}

await writeFile(outputUrl, output, "utf8");

console.log(`Generated ${fileURLToPath(outputUrl)}`);
