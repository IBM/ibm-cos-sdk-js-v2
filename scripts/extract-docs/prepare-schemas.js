/*
Prepare schema type declaration files for API extractor,
because it's broken.
*/

const path = require("node:path");
const fs = require("node:fs");
const { listFolders } = require("../utils/list-folders");

const root = path.join(__dirname, "..", "..");

const clients = listFolders(path.join(root, "clients"));
console.log("Found clients:", clients);

for (const client of clients) {
  const schemas_0_d_ts = path.join(root, "clients", client, "dist-types", "schemas", "schemas_0.d.ts");
  console.log("Checking path:", schemas_0_d_ts);
  if (fs.existsSync(schemas_0_d_ts)) {
    console.log("Found schema file, patching...");
    fs.writeFileSync(
      schemas_0_d_ts,
      fs.readFileSync(schemas_0_d_ts, "utf-8").replaceAll(/export declare var/g, "export declare const")
    );
  } else {
    console.log("Schema file not found at", schemas_0_d_ts);
  }
}
