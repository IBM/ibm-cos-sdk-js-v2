// smithy-typescript generated code
import type { AwsRegionExtensionConfiguration } from "@ibm-cos/types";
import type { HttpHandlerExtensionConfiguration } from "@smithy/protocol-http";
import type { DefaultExtensionConfiguration } from "@smithy/types";

import type { HttpAuthExtensionConfiguration } from "./auth/httpAuthExtensionConfiguration";

/**
 * @internal
 */
export interface S3ExtensionConfiguration
  extends HttpHandlerExtensionConfiguration,
    DefaultExtensionConfiguration,
    AwsRegionExtensionConfiguration,
    HttpAuthExtensionConfiguration {}
