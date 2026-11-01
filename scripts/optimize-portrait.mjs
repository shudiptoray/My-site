import path from "node:path";
import sharp from "sharp";

const [inputPath, outputPath = "public/shots/portrait.webp"] = process.argv.slice(2);

if (!inputPath) {
  throw new Error("Usage: node scripts/optimize-portrait.mjs <input-image> [output.webp]");
}

const output = await sharp(inputPath)
  .rotate()
  .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile(outputPath);

console.log(`Created ${path.resolve(outputPath)} (${output.width}x${output.height}, ${output.size} bytes).`);