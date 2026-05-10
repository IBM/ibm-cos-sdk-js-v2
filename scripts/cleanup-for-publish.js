#!/usr/bin/env node
/**
 * Cleanup script for publishing preparation
 * - Removes bundledDependencies from all packages
 * - Replaces workspace:* with actual version ranges
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function listFolders(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

const packageDirs = [
  ...listFolders(path.join(root, "packages")).map((f) => path.join(root, "packages", f)),
  ...listFolders(path.join(root, "packages-internal")).map((f) => path.join(root, "packages-internal", f)),
  ...listFolders(path.join(root, "lib")).map((f) => path.join(root, "lib", f)),
  ...listFolders(path.join(root, "clients")).map((f) => path.join(root, "clients", f)),
];

// Get current version from lerna.json
const lernaJson = JSON.parse(fs.readFileSync(path.join(root, "lerna.json"), "utf-8"));
const lernaVersion = lernaJson.version;

let changesCount = 0;

for (const packageDir of packageDirs) {
  const pkgJsonPath = path.join(packageDir, "package.json");
  
  if (!fs.existsSync(pkgJsonPath)) {
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  let modified = false;

  // Remove bundledDependencies
  if (pkgJson.bundledDependencies) {
    console.log(`Removing bundledDependencies from ${pkgJson.name}`);
    delete pkgJson.bundledDependencies;
    modified = true;
  }

  // Replace workspace:* in dependencies
  const depTypes = ["dependencies", "devDependencies", "peerDependencies"];
  for (const depType of depTypes) {
    if (pkgJson[depType]) {
      for (const [depName, depVersion] of Object.entries(pkgJson[depType])) {
        if (typeof depVersion === "string" && depVersion.startsWith("workspace:")) {
          // For internal @ibm-cos packages, use version range
          if (depName.startsWith("@ibm-cos/") || depName === "ibm-cos-sdk-v2") {
            pkgJson[depType][depName] = `^${lernaVersion}`;
            console.log(`  ${pkgJson.name}: ${depName} workspace:* -> ^${lernaVersion}`);
            modified = true;
          }
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");
    changesCount++;
  }
}

console.log(`\nCompleted! Modified ${changesCount} package.json files.`);
