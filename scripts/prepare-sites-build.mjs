import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const outputDir = path.join(projectDir, "dist", "server");

await mkdir(outputDir, { recursive: true });
await copyFile(
  path.join(projectDir, "worker", "index.js"),
  path.join(outputDir, "index.js"),
);
