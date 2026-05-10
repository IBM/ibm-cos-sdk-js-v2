// @ts-check
const { basename, join, relative, normalize } = require("path");
const { copySync, emptyDirSync, rmSync, copyFileSync } = require("fs-extra");
const { spawnProcess } = require("../utils/spawn-process");
const {
  CODE_GEN_ROOT,
  CODE_GEN_SDK_ROOT,
  CODE_GEN_SDK_OUTPUT_DIR,
  DEFAULT_CODE_GEN_INPUT_DIR,
  TEMP_CODE_GEN_INPUT_DIR,
  TEMP_CODE_GEN_SDK_OUTPUT_DIR,
} = require("./code-gen-dir");
const { getModelFilepaths } = require("./get-model-filepaths");

const generateClient = async (clientName) => {
  const TEMP_CODE_GEN_INPUT_DIR_SERVICE = join(TEMP_CODE_GEN_INPUT_DIR, clientName);

  emptyDirSync(normalize(join(__dirname, "..", "..", "codegen", "sdk-codegen", "build-single", clientName)));

  const options = [
    ":sdk-codegen:clean",
    ":sdk-codegen:build",
    "--stacktrace",
    // "--no-rebuild", // prevent dependency smithy-aws-typescript-codegen files from being rebuilt and possibly missing during multi-process
    `-PmodelsDirProp=${relative(CODE_GEN_SDK_ROOT, TEMP_CODE_GEN_INPUT_DIR_SERVICE)}`,
    `-PclientNameProp=${clientName}`,
  ];

  emptyDirSync(TEMP_CODE_GEN_INPUT_DIR_SERVICE);

  const filename = `${clientName}.json`;
  copyFileSync(join(DEFAULT_CODE_GEN_INPUT_DIR, filename), join(TEMP_CODE_GEN_INPUT_DIR_SERVICE, filename));

  await spawnProcess("./gradlew", options, { cwd: CODE_GEN_ROOT });
  rmSync(join(__dirname, "..", "..", "codegen", "sdk-codegen", `smithy-build-${clientName}.json`));
};

module.exports = {
  generateClient,
};
