import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const distDir = path.join(projectDir, "dist");
const outputDir = path.join(distDir, "server");

await mkdir(outputDir, { recursive: true });

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".geojson": "application/geo+json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function collectFiles(directory, relativeDirectory = "") {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (relativeDirectory === "" && entry.name === "server") {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.posix.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath, relativePath)));
    } else {
      files.push({ absolutePath, relativePath });
    }
  }

  return files;
}

const assets = {};

for (const file of await collectFiles(distDir)) {
  const extension = path.extname(file.relativePath).toLowerCase();
  assets[`/${file.relativePath}`] = {
    body: (await readFile(file.absolutePath)).toString("base64"),
    type: mimeTypes[extension] ?? "application/octet-stream",
  };
}

const workerSource = `const assets = ${JSON.stringify(assets)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const asset = assets[requestedPath] ?? (!requestedPath.includes(".") ? assets["/index.html"] : undefined);

    if (!asset) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers({ "Content-Type": asset.type });

    if (requestedPath.startsWith("/assets/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return new Response(request.method === "HEAD" ? null : decodeBase64(asset.body), {
      status: 200,
      headers,
    });
  },
};
`;

await writeFile(path.join(outputDir, "index.js"), workerSource, "utf8");
