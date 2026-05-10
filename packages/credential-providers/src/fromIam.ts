import { fromIam as _fromIam, FromIamInit } from "@ibm-cos/credential-provider-iam";
import { AwsCredentialIdentityProvider } from "@smithy/types";

/**
 * Creates a credential provider that uses IBM IAM authentication.
 *
 * This provider takes an input credential provider and enhances it with
 * IBM IAM token authentication by exchanging an API key for a bearer token.
 * The token is automatically cached and refreshed by the IBM Cloud SDK Core.
 *
 * @example
 * ```javascript
 * import { fromIam } from "@ibm-cos/credential-providers"; // ES6 import
 * // const { fromIam } = require("@ibm-cos/credential-providers"); // CommonJS import
 * import { S3Client } from "ibm-cos-sdk-v2";
 *
 * const client = new S3Client({
 *   credentials: fromIam(() => Promise.resolve({
 *     apiKey: 'your-api-key',
 *     serviceInstanceId: 'your-service-instance-id'
 *   }))
 * });
 * ```
 *
 * @param inputProvider - The credential provider that supplies the API key
 * @param init - Optional configuration
 * @returns A credential provider that includes IBM IAM session tokens
 *
 * @public
 */
export const fromIam = (
  inputProvider: AwsCredentialIdentityProvider,
  init?: FromIamInit
): AwsCredentialIdentityProvider => _fromIam(inputProvider, init);

// Made with Bob
