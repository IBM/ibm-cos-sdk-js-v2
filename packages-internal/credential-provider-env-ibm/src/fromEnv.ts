import { AwsCredentialIdentityProvider } from "@smithy/types";
import { CredentialProviderOptions } from "@ibm-cos/types";

export interface FromEnvInit extends CredentialProviderOptions { }

/**
 * @internal
 */
export const ENV_API = "IBM_API_KEY_ID";
/**
 * @internal
 */
export const ENV_SERVICE_INSTANCE = "IBM_SERVICE_INSTANCE_ID";
/**
 * @internal
 */
export const ENV_AUTH_ENDPOINT = "IBM_AUTH_ENDPOINT";

/**
 * @internal
 */
export const ibmFromEnv =
  (init?: FromEnvInit): AwsCredentialIdentityProvider =>
    async () => {
      init?.logger?.debug("@ibm-cos/credential-provider-env-ibm - fromIbmEnv");
      const apiKey = process.env[ENV_API];
      const serviceInstanceId = process.env[ENV_SERVICE_INSTANCE];
      const authEndpoint = process.env[ENV_AUTH_ENDPOINT];

      if (apiKey) {
          return {
              accessKeyId: "",
              secretAccessKey: "",
              apiKey,
              serviceInstanceId,
          };
      }

      throw new Error("Unable to find IBM environment variable credentials.");
};
