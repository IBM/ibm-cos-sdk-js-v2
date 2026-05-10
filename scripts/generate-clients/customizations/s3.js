const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..", "..");

const s3ClientDir = path.join(root, "clients", "client-s3");
const srcDir = path.join(s3ClientDir, "src");
const indexTs = path.join(srcDir, "index.ts");

/**
 * Customizes the generated S3 client to include presigning utilities.
 */
module.exports = function () {
    console.log("Applying S3 customizations (presigner)...");

    // 2. Update index.ts to export customizations
    let indexContents = fs.readFileSync(indexTs, "utf-8");

    // Remove any existing lines we might have added
    indexContents = indexContents.replace(/\nexport \* from ".\/presigner";\n/g, "");
    indexContents = indexContents.replace(/\nexport \* from ".\/lib-storage";\n/g, "");
    indexContents = indexContents.replace(/\nexport { .* } from ".*";\n/g, (match) => {
        if (match.includes("@ibm-cos/s3-request-presigner") ||
            match.includes("@ibm-cos/s3-presigned-post") ||
            match.includes("@ibm-cos/lib-storage")) {
            return "";
        }
        return match;
    });

    indexContents += '\n// Custom re-exports for IBM COS SDK\n';
    indexContents += 'export { getSignedUrl, S3RequestPresigner } from "@ibm-cos/s3-request-presigner";\n';
    indexContents += 'export { createPresignedPost } from "@ibm-cos/s3-presigned-post";\n';
    indexContents += 'export { Upload } from "@ibm-cos/lib-storage";\n';

    fs.writeFileSync(indexTs, indexContents);

    // 3. Ensure package.json has dependencies
    const packageJsonPath = path.join(s3ClientDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        let changed = false;

        if (!packageJson.dependencies["@ibm-cos/s3-request-presigner"]) {
            packageJson.dependencies["@ibm-cos/s3-request-presigner"] = "workspace:*";
            changed = true;
        }
        if (!packageJson.dependencies["@ibm-cos/s3-presigned-post"]) {
            packageJson.dependencies["@ibm-cos/s3-presigned-post"] = "workspace:*";
            changed = true;
        }
        if (!packageJson.dependencies["@ibm-cos/lib-storage"]) {
            packageJson.dependencies["@ibm-cos/lib-storage"] = "workspace:*";
            changed = true;
        }

        // Force @ibm-cos/client-s3 name in workspace for stability
        packageJson.name = "@ibm-cos/client-s3";
        changed = true;

        if (changed) {
            // Sort dependencies
            const sortedDeps = {};
            Object.keys(packageJson.dependencies)
                .sort()
                .forEach((key) => {
                    sortedDeps[key] = packageJson.dependencies[key];
                });
            packageJson.dependencies = sortedDeps;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
        }
    }
};
