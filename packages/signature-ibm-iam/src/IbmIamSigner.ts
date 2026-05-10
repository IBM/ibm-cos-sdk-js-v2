import { AwsSdkSigV4Signer } from "@ibm-cos/core";
import { HttpRequest } from "@smithy/protocol-http";
import {
    IbmAwsCredentialIdentity,
    isIbmCredentialIdentity,
} from "@ibm-cos/types-ibm";
import {
    HttpRequest as IHttpRequest,
    HttpResponse,
    HttpSigner,
} from "@smithy/types";

/**
 * @internal
 */
export class IbmIamSigner implements HttpSigner {
    private sigv4Signer = new AwsSdkSigV4Signer();

    async sign(
        httpRequest: IHttpRequest,
        identity: IbmAwsCredentialIdentity,
        signingProperties: Record<string, unknown>
    ): Promise<IHttpRequest> {
        if (!HttpRequest.isInstance(httpRequest)) {
            throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
        }

        if (isIbmCredentialIdentity(identity)) {
            const { sessionToken, serviceInstanceId } = identity;

            if (sessionToken) {
                httpRequest.headers["Authorization"] = `Bearer ${sessionToken}`;
            }
            if (serviceInstanceId && !httpRequest.headers["ibm-service-instance-id"]) {
                httpRequest.headers["ibm-service-instance-id"] = serviceInstanceId;
            }

            return httpRequest;
        }

        return this.sigv4Signer.sign(httpRequest, identity, signingProperties);
    }

    errorHandler(signingProperties: Record<string, unknown>): (error: Error) => never {
        return (error: Error) => {
            throw error;
        };
    }

    successHandler(httpResponse: HttpResponse | unknown, signingProperties: Record<string, unknown>): void {
    }
}
