import type { CredentialProviderOptions, RuntimeConfigAwsCredentialIdentityProvider } from "@ibm-cos/types";
import { fromIniIbm } from "@ibm-cos/credential-provider-ini-ibm";
import { chain } from "@smithy/property-provider";
import { getProfileName, parseKnownFiles, SourceProfileInit } from "@smithy/shared-ini-file-loader";
import type { AwsCredentialIdentity, Pluggable } from "@smithy/types";

import { AssumeRoleParams } from "./resolveAssumeRoleCredentials";
import { resolveProfileData } from "./resolveProfileData";

/**
 * @public
 */
export interface FromIniInit extends SourceProfileInit, CredentialProviderOptions {
  /**
   * A function that returns a promise fulfilled with an MFA token code for
   * the provided MFA Serial code. If a profile requires an MFA code and
   * `mfaCodeProvider` is not a valid function, the credential provider
   * promise will be rejected.
   *
   * @param mfaSerial The serial code of the MFA device specified.
   */
  mfaCodeProvider?: (mfaSerial: string) => Promise<string>;

  /**
   * A function that assumes a role and returns a promise fulfilled with
   * credentials for the assumed role.
   *
   * @param sourceCreds The credentials with which to assume a role.
   * @param params
   */
  roleAssumer?: (sourceCreds: AwsCredentialIdentity, params: AssumeRoleParams) => Promise<AwsCredentialIdentity>;



  /**
   * AWS SDK Client configuration to be used for creating inner client
   * for auth operations. Inner clients include STS, SSO, and Signin clients.
   * @internal
   */
  clientConfig?: any;

  clientPlugins?: Pluggable<any, any>[];

  /**
   * When true, always reload credentials from the file system instead of using cached values.
   * This is useful when you need to detect changes to the credentials file.
   */
  ignoreCache?: boolean;
}

/**
 * @internal
 *
 * Creates a credential provider that will read from ini files and supports
 * role assumption and multi-factor authentication.
 */
const awsFromIni =
  (init: FromIniInit = {}): RuntimeConfigAwsCredentialIdentityProvider =>
    async ({ callerClientConfig } = {}) => {
      init.logger?.debug("@ibm-cos/credential-provider-ini - fromIni");
      const profiles = await parseKnownFiles(init);
      return resolveProfileData(
        getProfileName({
          profile: init.profile ?? callerClientConfig?.profile,
        }),
        profiles,
        init,
        callerClientConfig
      );
    };

/**
 * @internal
 */
export const fromIni = (init: FromIniInit = {}): RuntimeConfigAwsCredentialIdentityProvider =>
  (args) => chain(() => fromIniIbm(init)(args), () => awsFromIni(init)(args))();
