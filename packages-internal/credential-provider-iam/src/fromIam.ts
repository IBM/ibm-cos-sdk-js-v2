import { AwsCredentialIdentity, AwsCredentialIdentityProvider } from "@smithy/types";
import { IamTokenManager } from "ibm-cloud-sdk-core";

/**
 * Configuration options for IBM IAM credential provider.
 * @internal
 */
export interface FromIamInit {
  // Reserved for future configuration options
}

/**
 * Creates a credential provider that uses IBM IAM authentication.
 * 
 * This provider takes an input credential provider and enhances it with
 * IBM IAM token authentication by exchanging an API key for a bearer token.
 * The token is automatically cached and refreshed by the IBM Cloud SDK Core.
 * 
 * @param inputProvider - The credential provider that supplies the API key
 * @param init - Optional configuration
 * @returns A credential provider that includes IBM IAM session tokens
 * 
 * @internal
 */
/**
 * Internal implementation of IAM credential provider.
 * @internal
 */
const iamCredentialProviderImpl = (
  inputProvider: AwsCredentialIdentityProvider,
  init?: FromIamInit
): AwsCredentialIdentityProvider => {
  let tokenManager: IamTokenManager | undefined;

  return async (): Promise<AwsCredentialIdentity> => {
    const creds = await inputProvider();
    const apiKey = (creds as any).apiKey;
    const authEndpoint = (creds as any).authEndpoint;

    if (!apiKey) {
      return creds;
    }

    // Create tokenManager once and reuse (it handles caching internally)
    if (!tokenManager) {
      tokenManager = new IamTokenManager({
        apikey: apiKey,
        ...(authEndpoint && { url: authEndpoint }),
      });
    }

    // getToken() automatically handles caching and refreshing
    const token = await tokenManager.getToken();

    return {
      ...creds,
      sessionToken: token,
    };
  };
};

/**
 * Export with the name expected by internal packages.
 * @internal
 */
export function iamCredentialProvider(
  inputProvider: AwsCredentialIdentityProvider,
  init?: FromIamInit
): AwsCredentialIdentityProvider {
  return iamCredentialProviderImpl(inputProvider, init);
}

/**
 * Export with the name for public API.
 * @internal
 */
export function fromIam(
  inputProvider: AwsCredentialIdentityProvider,
  init?: FromIamInit
): AwsCredentialIdentityProvider {
  return iamCredentialProviderImpl(inputProvider, init);
}

// Made with Bob
