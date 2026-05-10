#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Simple dependency synchronization script
 * Replaces syncpack with a straightforward approach:
 * 1. Reads dependency-registry.json as the single source of truth
 * 2. Updates all workspace packages to use these exact versions
 * 3. Supports workspace:* protocol for internal packages
 */

const REGISTRY_PATH = path.join(__dirname, '../dependency-registry.json');
const ROOT_PKG_PATH = path.join(__dirname, '../package.json');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    log('❌ dependency-registry.json not found!', 'red');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
}

function getWorkspacePackages() {
  const rootPkg = JSON.parse(fs.readFileSync(ROOT_PKG_PATH, 'utf-8'));
  const workspacePatterns = rootPkg.workspaces?.packages || [];
  const packages = [];

  workspacePatterns.forEach(pattern => {
    const baseDir = pattern.replace('/*', '');
    const fullPath = path.join(__dirname, '..', baseDir);
    
    if (!fs.existsSync(fullPath)) return;

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    entries.forEach(entry => {
      if (!entry.isDirectory()) return;

      const pkgPath = path.join(fullPath, entry.name, 'package.json');
      if (fs.existsSync(pkgPath)) {
        packages.push({
          path: pkgPath,
          dir: path.join(fullPath, entry.name),
          pkg: JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
        });
      }
    });
  });

  return packages;
}

function isInternalPackage(depName) {
  return depName.startsWith('@ibm-cos/') || depName === 'ibm-cos-sdk-v2';
}

function syncDependencies(options = {}) {
  const { dryRun = false, verbose = false } = options;
  
  log('\n🔄 Syncing dependencies from registry...\n', 'cyan');

  const registry = loadRegistry();
  const allRegistryDeps = {
    ...registry.dependencies,
    ...registry.devDependencies
  };
  const allowedExceptions = new Set(
    registry.workspaceSpecificDevDependencies?.allowed || []
  );

  const packages = getWorkspacePackages();
  let totalUpdates = 0;
  let totalViolations = 0;
  const violations = [];

  packages.forEach(({ path: pkgPath, pkg }) => {
    let updated = false;
    let pkgUpdates = 0;

    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (!pkg[depType]) return;

      Object.keys(pkg[depType]).forEach(depName => {
        const currentVersion = pkg[depType][depName];

        // Skip internal packages - use workspace:* protocol
        if (isInternalPackage(depName)) {
          if (currentVersion !== 'workspace:*') {
            pkg[depType][depName] = 'workspace:*';
            updated = true;
            pkgUpdates++;
            if (verbose) {
              log(`  ${pkg.name}: ${depName} → workspace:*`, 'yellow');
            }
          }
          return;
        }

        // Skip allowed workspace-specific dependencies
        if (allowedExceptions.has(depName)) {
          return;
        }

        // Check if dependency exists in registry
        if (!allRegistryDeps[depName]) {
          violations.push({
            package: pkg.name,
            dependency: depName,
            version: currentVersion,
            type: depType
          });
          totalViolations++;
          return;
        }

        // Update to registry version if different
        const registryVersion = allRegistryDeps[depName];
        if (currentVersion !== registryVersion) {
          pkg[depType][depName] = registryVersion;
          updated = true;
          pkgUpdates++;
          if (verbose) {
            log(`  ${pkg.name}: ${depName} ${currentVersion} → ${registryVersion}`, 'yellow');
          }
        }
      });

      // Sort dependencies alphabetically
      if (pkg[depType]) {
        pkg[depType] = Object.keys(pkg[depType])
          .sort()
          .reduce((acc, key) => {
            acc[key] = pkg[depType][key];
            return acc;
          }, {});
      }
    });

    if (updated) {
      totalUpdates += pkgUpdates;
      if (!dryRun) {
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      }
      log(`✓ ${pkg.name}: ${pkgUpdates} updates`, 'green');
    }
  });

  // Report results
  log('\n' + '='.repeat(60), 'blue');
  
  if (totalUpdates > 0) {
    log(`✅ Updated ${totalUpdates} dependencies across ${packages.length} packages`, 'green');
    if (dryRun) {
      log('   (Dry run - no files were modified)', 'yellow');
    }
  } else {
    log('✅ All dependencies are already in sync', 'green');
  }

  if (violations.length > 0) {
    log(`\n⚠️  Found ${totalViolations} dependencies not in registry:`, 'yellow');
    violations.forEach(v => {
      log(`   ${v.package} (${v.type}): ${v.dependency}@${v.version}`, 'red');
    });
    log('\n📝 Action required:', 'yellow');
    log('   1. Add missing dependencies to dependency-registry.json', 'yellow');
    log('   2. Run: yarn deps:sync', 'yellow');
    log('   3. Run: yarn install\n', 'yellow');
    process.exit(1);
  }

  if (!dryRun && totalUpdates > 0) {
    log('\n📝 Next steps:', 'cyan');
    log('   Run: yarn install', 'cyan');
    log('');
  }
}

function validateRegistry() {
  log('\n🔍 Validating dependency registry...\n', 'cyan');

  const registry = loadRegistry();
  const packages = getWorkspacePackages();
  const allRegistryDeps = {
    ...registry.dependencies,
    ...registry.devDependencies
  };
  const allowedExceptions = new Set(
    registry.workspaceSpecificDevDependencies?.allowed || []
  );

  const violations = [];
  const usedDeps = new Set();

  packages.forEach(({ pkg }) => {
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (!pkg[depType]) return;

      Object.keys(pkg[depType]).forEach(depName => {
        // Skip internal packages
        if (isInternalPackage(depName)) return;
        
        // Skip allowed exceptions
        if (allowedExceptions.has(depName)) return;

        usedDeps.add(depName);

        // Check if dependency exists in registry
        if (!allRegistryDeps[depName]) {
          violations.push({
            package: pkg.name,
            dependency: depName,
            version: pkg[depType][depName],
            type: depType
          });
        }
      });
    });
  });

  if (violations.length === 0) {
    log('✅ All workspace dependencies are defined in registry', 'green');
    log(`   Total external dependencies: ${usedDeps.size}`, 'green');
    log('');
    return true;
  }

  log('❌ Found dependencies not in registry:\n', 'red');
  violations.forEach(v => {
    log(`   ${v.package} (${v.type}): ${v.dependency}@${v.version}`, 'red');
  });
  log('\n📝 Add these to dependency-registry.json\n', 'yellow');
  return false;
}

function listDependencies() {
  log('\n📦 Listing all dependencies...\n', 'cyan');

  const packages = getWorkspacePackages();
  const deps = {
    internal: new Set(),
    external: new Set()
  };

  packages.forEach(({ pkg }) => {
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (!pkg[depType]) return;

      Object.keys(pkg[depType]).forEach(depName => {
        if (isInternalPackage(depName)) {
          deps.internal.add(depName);
        } else {
          deps.external.add(depName);
        }
      });
    });
  });

  log('=== INTERNAL DEPENDENCIES ===', 'blue');
  Array.from(deps.internal).sort().forEach(dep => log(`  ${dep}`, 'cyan'));

  log('\n=== EXTERNAL DEPENDENCIES ===', 'blue');
  Array.from(deps.external).sort().forEach(dep => log(`  ${dep}`, 'cyan'));

  log(`\nTotal Internal: ${deps.internal.size}`, 'green');
  log(`Total External: ${deps.external.size}`, 'green');
  log('');
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'sync':
    syncDependencies({ 
      dryRun: args.includes('--dry-run'),
      verbose: args.includes('--verbose') || args.includes('-v')
    });
    break;
  
  case 'validate':
    const isValid = validateRegistry();
    process.exit(isValid ? 0 : 1);
    break;
  
  case 'list':
    listDependencies();
    break;
  
  case 'help':
  case '--help':
  case '-h':
    log('\n📚 Dependency Management Script', 'cyan');
    log('\nUsage:', 'blue');
    log('  node scripts/sync-dependencies.js <command> [options]', 'cyan');
    log('\nCommands:', 'blue');
    log('  sync       Sync all workspace dependencies from registry', 'cyan');
    log('  validate   Check if all dependencies are in registry', 'cyan');
    log('  list       List all internal and external dependencies', 'cyan');
    log('  help       Show this help message', 'cyan');
    log('\nOptions:', 'blue');
    log('  --dry-run  Show what would be changed without modifying files', 'cyan');
    log('  --verbose  Show detailed update information', 'cyan');
    log('  -v         Alias for --verbose', 'cyan');
    log('\nExamples:', 'blue');
    log('  yarn deps:sync', 'cyan');
    log('  yarn deps:sync --dry-run', 'cyan');
    log('  yarn deps:validate', 'cyan');
    log('  yarn deps:list\n', 'cyan');
    break;
  
  default:
    log('❌ Unknown command. Use "help" to see available commands.', 'red');
    process.exit(1);
}

// Made with Bob
