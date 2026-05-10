// @ts-check
const yargs = require("yargs");
const path = require("path");
const { emptyDirSync, rmdirSync } = require("fs-extra");
const { copyToClients } = require("./copy-to-clients");
const {
  CODE_GEN_SDK_OUTPUT_DIR,
  CODE_GEN_GENERIC_CLIENT_OUTPUT_DIR,
  CODE_GEN_PROTOCOL_TESTS_OUTPUT_DIR,
  TEMP_CODE_GEN_INPUT_DIR,
} = require("./code-gen-dir");
const { generateClient } = require("./code-gen");
const { buildSmithyTypeScript } = require("./build-smithy-typescript");
const { SMITHY_TS_COMMIT } = require("./config");
const { spawnProcess } = require("../utils/spawn-process");

const REPO_ROOT = path.join(__dirname, "..", "..");
const SMITHY_TS_DIR = path.normalize(path.join(__dirname, "..", "..", "..", "smithy-typescript"));
const SDK_CLIENTS_DIR = path.normalize(path.join(__dirname, "..", "..", "clients"));

const {
  output: clientsDir,
  noPrivateClients,
  keepFiles,
  repo,
  commit,
  d: noSmithyCheckout,
} = yargs(process.argv.slice(2))
  .alias("o", "output")
  .string("o")
  .describe("o", "The output directory for built clients")
  .default("o", SDK_CLIENTS_DIR)
  .alias("n", "noPrivateClients")
  .boolean("n")
  .describe("n", "Disable generating private clients")
  .default("n", true)
  .alias("d", "noSmithyCheckout")
  .boolean("d")
  .describe("d", "use existing Smithy version instead of target hash")
  .boolean("keepFiles")
  .describe("keepFiles", "Don't clean up temp files")
  .describe("r", "The location where smithy-typescript is cloned.")
  .string("r")
  .alias("r", "repo")
  .default("r", SMITHY_TS_DIR)
  .describe("c", "The smithy-typescript commit to be used for codegen.")
  .string("c")
  .alias("c", "commit")
  .default("c", SMITHY_TS_COMMIT)
  .help().argv;

(async () => {
  try {
    if (!noSmithyCheckout) {
      await buildSmithyTypeScript(repo, commit);
    }

    await generateClient("s3");
    await copyToClients(path.join(__dirname, "..", "..", "codegen", "sdk-codegen", "build-single", "s3"), clientsDir);

    const compress = require("../endpoints-ruleset/compress");
    compress();

    if (!keepFiles) {
      emptyDirSync(CODE_GEN_SDK_OUTPUT_DIR);
      if (!noPrivateClients) {
        emptyDirSync(CODE_GEN_GENERIC_CLIENT_OUTPUT_DIR);
        emptyDirSync(CODE_GEN_PROTOCOL_TESTS_OUTPUT_DIR);
      }
      emptyDirSync(TEMP_CODE_GEN_INPUT_DIR);
      rmdirSync(TEMP_CODE_GEN_INPUT_DIR);
    }

    await spawnProcess("yarn", ["install", "--no-immutable"], {
      cwd: REPO_ROOT,
      stdio: "inherit",
      env: { ...process.env, CI: "" },
    });
    require("../runtime-dependency-version-check/runtime-dep-version-check");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
