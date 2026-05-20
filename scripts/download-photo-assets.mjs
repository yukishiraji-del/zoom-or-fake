import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = dirname(fileURLToPath(import.meta.url));
const photoRoot = join(root, "..", "public", "images", "photos");
const realDir = join(photoRoot, "real");
const fakeDir = join(photoRoot, "fake");

mkdirSync(realDir, { recursive: true });
mkdirSync(fakeDir, { recursive: true });

const realSources = Array.from({ length: 30 }, (_, index) => index + 1);

async function fetchImage(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "user-agent": "FakeOrRealPrototype/1.0",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1024) {
    throw new Error(`Downloaded file from ${url} is too small`);
  }

  return buffer;
}

function hash(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function downloadRealPhotos() {
  for (let i = 0; i < realSources.length; i += 1) {
    const url = `https://i.pravatar.cc/512?img=${realSources[i]}`;
    const buffer = await fetchImage(url);
    writeFileSync(join(realDir, `real-${String(i + 1).padStart(2, "0")}.jpg`), buffer);
    console.log(`real-${String(i + 1).padStart(2, "0")}.jpg`);
  }
}

async function downloadFakePhotos() {
  const seen = new Set();

  for (let i = 0; i < 30; i += 1) {
    let buffer;
    let attempts = 0;

    do {
      attempts += 1;
      buffer = await fetchImage(`https://100k-faces.vercel.app/api/random-image?slot=${i}&attempt=${attempts}`);
      const digest = hash(buffer);
      if (!seen.has(digest)) {
        seen.add(digest);
        break;
      }
      buffer = undefined;
    } while (attempts < 8);

    if (!buffer) {
      throw new Error(`Could not get a unique AI face for slot ${i + 1}`);
    }

    writeFileSync(join(fakeDir, `fake-${String(i + 1).padStart(2, "0")}.jpg`), buffer);
    console.log(`fake-${String(i + 1).padStart(2, "0")}.jpg`);
  }
}

await downloadRealPhotos();
await downloadFakePhotos();
