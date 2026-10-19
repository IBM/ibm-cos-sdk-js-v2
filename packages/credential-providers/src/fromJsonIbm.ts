import { fromJsonIbm as _fromJson, FromJsonIbmInit } from "@ibm-cos/credential-provider-json-ibm";
import type { AwsCredentialIdentityProvider } from "@smithy/types";

/**
 * Creates a credential provider that reads IBM COS credentials from a JSON
 * file, defaulting to `~/.bluemix/cos_credentials`.
 *
 * The file is expected to be in the following format:
 *
 * ```json
 * {
 *   "apikey": "<IBM IAM API key>",
 *   "resource_instance_id": "<service instance CRN>",
 *   "cos_hmac_keys": {
 *     "access_key_id": "<HMAC access key>",
 *     "secret_access_key": "<HMAC secret key>"
 *   }
 * }
 * ```
 *
 * When both `apikey` and `cos_hmac_keys` are present, the IAM API key takes
 * precedence. If the file does not exist the provider continues to the next
 * provider in the chain (e.g. `fromIni`) rather than throwing a fatal error.
 *
 * ```javascript
 * import { fromJson } from "@ibm-cos/credential-providers"; // ES6 import
 * // const { fromJson } = require("@ibm-cos/credential-providers"); // CommonJS import
 *
 * const client = new S3Client({
 *   credentials: fromJson({
 *     // Optional. Absolute path to the JSON credentials file.
 *     // Defaults to $COS_CREDENTIALS_FILE or ~/.bluemix/cos_credentials.
 *     filepath: "/path/to/cos_credentials",
 *     // Optional. IBM IAM authentication endpoint URL.
 *     // Defaults to $IBM_AUTH_ENDPOINT,
 *     // then the IBM Cloud SDK Core default IAM endpoint.
 *     authEndpoint: "https://iam.cloud.ibm.com/identity/token",
 *   }),
 * });
 * ```
 *
 * @public
 */
export const fromJson = (init: FromJsonIbmInit = {}): AwsCredentialIdentityProvider =>
  _fromJson({ ...init });
