import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const destination = resolve(root, "hosting/chatgpt");
await mkdir(destination, { recursive: true });
for (const folder of ["src", "server", "public"])
  await cp(resolve(root, folder), resolve(destination, folder), {
    recursive: true,
    filter: (source) => !source.endsWith(".test.ts"),
  });
let app = await readFile(resolve(destination, "src/App.tsx"), "utf8");
await writeFile(resolve(destination, "src/App.tsx"), '"use client";\n' + app);
console.log(
  "Copied shared comic and API source into the ChatGPT Sites checkout. No environment files copied.",
);
