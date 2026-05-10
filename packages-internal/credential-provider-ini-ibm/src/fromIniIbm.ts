import { CredentialsProviderError, chain } from "@smithy/property-provider";
import { getProfileName, parseKnownFiles, SourceProfileInit } from "@smithy/shared-ini-file-loader";
import { AwsCredentialIdentityProvider } from "@smithy/types";
import { CredentialProviderOptions, RuntimeConfigAwsCredentialIdentityProvider } from "@ibm-cos/types";

export interface FromIniInit extends SourceProfileInit, CredentialProviderOptions { }

/**
 * @internal
 */
export const PROFILE_IBM_API_KEY = "ibm_api_key_id";
/**
 * @internal
 */
export const PROFILE_IBM_SERVICE_INSTANCE = "ibm_service_instance_id";
/**
 * @internal
 */
export const PROFILE_IBM_AUTH_ENDPOINT = "ibm_auth_endpoint";

/**
 * @internal
 */
export const fromIniIbm =
    (init: FromIniInit = {}): RuntimeConfigAwsCredentialIdentityProvider =>
        async ({ callerClientConfig } = {}) => {
            init.logger?.debug("@ibm-cos/credential-provider-ini-ibm - fromIniIbm");
            const profiles = await parseKnownFiles(init);
            const profileName = getProfileName({
                profile: init.profile ?? callerClientConfig?.profile,
            });
            const profile = profiles[profileName];

            if (profile && profile[PROFILE_IBM_API_KEY]) {
                return {
                    accessKeyId: "",
                    secretAccessKey: "",
                    apiKey: profile[PROFILE_IBM_API_KEY],
                    serviceInstanceId: profile[PROFILE_IBM_SERVICE_INSTANCE],
                    authEndpoint: profile[PROFILE_IBM_AUTH_ENDPOINT],
                };
            }

            throw new CredentialsProviderError(`Profile ${profileName} does not contain IBM credentials.`, {
                tryNextLink: true,
                logger: init.logger,
            });
        };
