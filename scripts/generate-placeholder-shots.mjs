import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const directory = path.resolve("public/shots");
const widths = [384, 640, 1200];
const sources = (await readdir(directory)).filter((file) => file.endsWith(".svg"));

await Promise.all(sources.flatMap((file) => widths.map((width) => {
  const source = path.join(directory, file);
  const output = path.join(directory, `${path.parse(file).name}-${width}.webp`);
  return sharp(source).resize({ width }).webp({ quality: 84 }).toFile(output);
})));

console.log(`Generated ${sources.length * widths.length} placeholder WebP images.`);