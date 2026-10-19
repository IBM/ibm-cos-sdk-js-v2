import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { CredentialsProviderError } from "@smithy/property-provider";
import type { AwsCredentialIdentity } from "@smithy/types";
import type { CredentialProviderOptions } from "@ibm-cos/types";

/**
 * Environment variable that overrides the default JSON credentials file path.
 * @public
 */
export const ENV_COS_CREDENTIALS_FILE = "COS_CREDENTIALS_FILE";

/**
 * Environment variable that overrides the IBM IAM authentication endpoint.
 * @public
 */
export const ENV_IBM_AUTH_ENDPOINT = "IBM_AUTH_ENDPOINT";

/**
 * Default path to the IBM COS JSON credentials file.
 * @public
 */
export const DEFAULT_COS_CREDENTIALS_PATH = path.join(".bluemix", "cos_credentials");

/**
 * Options for the fromJsonIbm credential provider.
 * @public
 */
export interface FromJsonIbmInit extends CredentialProviderOptions {
  /**
   * Absolute path to the JSON credentials file.
   * Defaults to the `COS_CREDENTIALS_FILE` environment variable,
   * then `~/.bluemix/cos_credentials`.
   */
  filepath?: string;

  /**
   * IBM IAM authentication endpoint URL.
   * Overrides the `authEndpoint` field in the credentials file and the
   * `IBM_AUTH_ENDPOINT` environment variable.
   * When omitted, the value from the JSON file is used; if absent there too,
   * the IBM Cloud SDK Core default IAM endpoint is used.
   */
  authEndpoint?: string;
}

/**
 * Shape of the IBM COS JSON credentials file.
 * @internal
 */
interface CosCredentialsFile {
  apikey?: string;
  cos_hmac_keys?: {
    access_key_id: string;
    secret_access_key: string;
  };
  endpoints?: string;
  iam_apikey_description?: string;
  iam_apikey_name?: string;
  iam_role_crn?: string;
  iam_serviceid_crn?: string;
  resource_instance_id?: string;
}

/**
 * Creates a credential provider that reads IBM COS credentials from a JSON
 * file, defaulting to `~/.bluemix/cos_credentials` or `$COS_CREDENTIALS_FILE`.
 *
 * ## File format
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
 * precedence.
 *
 * If the file does not exist the provider throws with `tryNextLink: true`
 * so the credential chain continues to the next provider (e.g. `fromIni`).
 *
 * @public
 */
export const fromJsonIbm =
  (init: FromJsonIbmInit = {}) =>
  async (): Promise<AwsCredentialIdentity> => {
    init.logger?.debug("@ibm-cos/credential-provider-json-ibm - fromJsonIbm");

    const filepath = resolveFilepath(init.filepath);

    const json = readAndParseFile(filepath, init);

    // IAM API key takes precedence — the IAM middleware handles token exchange.
    if (json.apikey) {
      init.logger?.debug(
        "@ibm-cos/credential-provider-json-ibm - fromJsonIbm: resolved IAM API key credentials"
      );
      const authEndpoint =
        init.authEndpoint ??
        process.env[ENV_IBM_AUTH_ENDPOINT]
      return {
        accessKeyId: "",
        secretAccessKey: "",
        apiKey: json.apikey,
        serviceInstanceId: json.resource_instance_id,
        ...(authEndpoint && { authEndpoint }),
      };
    }

    // Fall back to HMAC keys — no IAM token exchange needed
    const hmac = json.cos_hmac_keys;
    if (hmac?.access_key_id && hmac?.secret_access_key) {
      init.logger?.debug(
        "@ibm-cos/credential-provider-json-ibm - fromJsonIbm: resolved HMAC credentials"
      );
      return {
        accessKeyId: hmac.access_key_id,
        secretAccessKey: hmac.secret_access_key,
      };
    }

    throw new CredentialsProviderError(
      `No valid credentials found in ${filepath}. ` +
        `Expected cos_hmac_keys.access_key_id/secret_access_key or apikey.`,
      { tryNextLink: true, logger: init?.logger }
    );
  };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the credential file path in order:
 *  1. Explicit `filepath` option
 *  2. `COS_CREDENTIALS_FILE` environment variable
 *  3. `~/.bluemix/cos_credentials`
 * @internal
 */
const resolveFilepath = (filepath?: string): string =>
  filepath ??
  process.env[ENV_COS_CREDENTIALS_FILE] ??
  path.join(os.homedir(), DEFAULT_COS_CREDENTIALS_PATH);

/**
 * Reads and JSON-parses the credentials file.
 * - Throws with `tryNextLink: true` when the file is missing (continue chain).
 * - Throws with `tryNextLink: false` when the file exists but is invalid JSON
 *   (stop chain and surface a clear error to the caller).
 * @internal
 */
const readAndParseFile = (filepath: string, init: FromJsonIbmInit): CosCredentialsFile => {
  let raw: string;
  try {
    raw = fs.readFileSync(filepath, "utf-8");
  } catch {
    throw new CredentialsProviderError(
      `IBM COS JSON credentials file not found at ${filepath}`,
      { tryNextLink: true, logger: init.logger }
    );
  }

  try {
    return JSON.parse(raw) as CosCredentialsFile;
  } catch {
    throw new CredentialsProviderError(
      `Failed to parse IBM COS JSON credentials file at ${filepath}`,
      { tryNextLink: false, logger: init.logger }
    );
  }
};
