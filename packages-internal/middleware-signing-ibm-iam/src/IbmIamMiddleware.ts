import { IbmIamSigner } from "@ibm-cos/signature-ibm-iam";
import { HttpRequest } from "@smithy/protocol-http";
import {
    IbmAwsCredentialIdentity,
    isIbmCredentialIdentity,
} from "@ibm-cos/types-ibm";
import {
    HttpRequest as IHttpRequest,
    Pluggable,
} from "@smithy/types";

/**
 * @internal
 * @deprecated Use IbmIamSigner with the HttpAuthScheme system instead.
 */
export const ibmIamMiddleware = (config: any) => (next: any, context: any) => async (args: any) => {
    const { request } = args;
    if (!HttpRequest.isInstance(request)) {
        return next(args);
    }

    const creds = await config.credentials();

    // Type guard for IBM IAM credentials
    if (creds && isIbmCredentialIdentity(creds)) {
        const signer = new IbmIamSigner();
        await signer.sign(request, creds as IbmAwsCredentialIdentity, { context });

        // Set a no-op signer in the context to prevent standard SigV4 signing
        context.signer = {
            sign: async (req: IHttpRequest) => req,
            errorHandler: (err: Error) => {
                return (error: Error) => {
                    throw error;
                };
            },
            successHandler: () => { },
        };
    }

    return next(args);
};

/**
 * @internal
 */
export const getIbmIamPlugin = (config: any): Pluggable<any, any> => ({
    applyToStack: (clientStack) => {
        clientStack.add(ibmIamMiddleware(config), {
            step: "finalizeRequest",
            name: "ibmIamMiddleware",
            tags: ["IBM", "IAM", "AUTH"],
            priority: "high",
        });
    },
});
