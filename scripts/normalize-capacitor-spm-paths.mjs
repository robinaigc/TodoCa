import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageSwiftUrl = new URL("../ios/App/CapApp-SPM/Package.swift", import.meta.url);
const packageSwiftPath = fileURLToPath(packageSwiftUrl);
const source = await readFile(packageSwiftPath, "utf8");
const normalized = source.replace(
  /(\.package\([^\r\n]*?path:\s*")([^"]+)(")/g,
  (_match, before, packagePath, after) =>
    `${before}${packagePath.replaceAll("\\", "/")}${after}`,
);

if (normalized !== source) {
  await writeFile(packageSwiftPath, normalized, "utf8");
  console.log("Normalized local Swift package paths for macOS/Xcode.");
}
