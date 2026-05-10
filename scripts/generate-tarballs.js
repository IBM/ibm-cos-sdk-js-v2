#!/usr/bin/env node
/**
 * Generate tarballs for all packages
 * Resolves workspace:* dependencies before packing
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist-tarballs");

function listFolders(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

// Clean and create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const packageDirs = [
  ...listFolders(path.join(root, "packages")).map((f) => ({
    name: f,
    path: path.join(root, "packages", f),
  })),
  ...listFolders(path.join(root, "packages-internal")).map((f) => ({
    name: f,
    path: path.join(root, "packages-internal", f),
  })),
  ...listFolders(path.join(root, "lib")).map((f) => ({
    name: f,
    path: path.join(root, "lib", f),
  })),
  ...listFolders(path.join(root, "clients")).map((f) => ({
    name: f,
    path: path.join(root, "clients", f),
  })),
];

console.log("Resolving workspace:* dependencies...");
try {
  execSync("node scripts/cleanup-for-publish.js", { cwd: root, stdio: "inherit" });
} catch (error) {
  console.error("Cleanup failed:", error.message);
  process.exit(1);
}

let successCount = 0;
let skipCount = 0;

console.log("\nGenerating tarballs...\n");

for (const { name, path: packagePath } of packageDirs) {
  const pkgJsonPath = path.join(packagePath, "package.json");

  if (!fs.existsSync(pkgJsonPath)) {
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

  // Skip private packages
  if (pkgJson.private) {
    console.log(`Skipping ${pkgJson.name} (private)`);
    skipCount++;
    continue;
  }

  try {
    console.log(`Packing ${pkgJson.name}@${pkgJson.version}...`);

    execSync(`npm pack --pack-destination "${distDir}"`, {
      cwd: packagePath,
      encoding: "utf-8",
      stdio: "inherit",
    });

    successCount++;
  } catch (error) {
    console.error(`Failed to pack ${pkgJson.name}:`, error.message);
  }
}

console.log("\nRestoring package.json files...");
try {
  execSync("git restore 'packages/*/package.json' 'packages-internal/*/package.json' 'lib/*/package.json' 'clients/*/package.json'", {
    cwd: root,
    stdio: "inherit",
    shell: true
  });
  console.log(" Restored all package.json files");
} catch (error) {
  console.warn("Could not restore package.json files:", error.message);
}

console.log("\n" + "=".repeat(60));
console.log("TARBALL GENERATION COMPLETE");
console.log("=".repeat(60));
console.log(`Successfully packed: ${successCount} packages`);
console.log(`Skipped: ${skipCount} packages`);
console.log(` Output directory: ${distDir}`);
console.log("=".repeat(60));
