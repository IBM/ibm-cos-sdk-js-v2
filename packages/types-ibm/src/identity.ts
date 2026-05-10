import { AwsCredentialIdentity } from "@smithy/types";

/**
 * @internal
 * IBM-specific extension of AwsCredentialIdentity
 */
export interface IbmAwsCredentialIdentity extends AwsCredentialIdentity {
    readonly apiKey?: string;
    readonly authEndpoint?: string;
    readonly serviceInstanceId?: string;
}

/**
 * @internal
 * Type guard to check if an identity contains IBM-specific properties.
 * Returns true if any of the IBM-specific keys are present.
 */
export const isIbmCredentialIdentity = (identity: AwsCredentialIdentity): identity is IbmAwsCredentialIdentity => {
    const ibmIdentity = identity as IbmAwsCredentialIdentity;
    return !!(ibmIdentity.apiKey || ibmIdentity.serviceInstanceId || ibmIdentity.authEndpoint);
};
