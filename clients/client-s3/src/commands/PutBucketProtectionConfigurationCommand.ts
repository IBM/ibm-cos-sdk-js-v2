// smithy-typescript generated code
import { getFlexibleChecksumsPlugin } from "@ibm-cos/middleware-flexible-checksums";
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { PutBucketProtectionConfigurationInput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { PutBucketProtectionConfiguration$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link PutBucketProtectionConfigurationCommand}.
 */
export interface PutBucketProtectionConfigurationCommandInput extends PutBucketProtectionConfigurationInput {}
/**
 * @public
 *
 * The output of {@link PutBucketProtectionConfigurationCommand}.
 */
export interface PutBucketProtectionConfigurationCommandOutput extends __MetadataBearer {}

/**
 * <p>Sets the protection configuration for a bucket.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, PutBucketProtectionConfigurationCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, PutBucketProtectionConfigurationCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // PutBucketProtectionConfigurationInput
 *   Bucket: "STRING_VALUE", // required
 *   ProtectionConfiguration: { // ProtectionConfiguration
 *     Status: "STRING_VALUE",
 *     MinimumRetention: { // MinimumRetentionPeriod
 *       Days: Number("int"), // required
 *     },
 *     DefaultRetention: { // DefaultRetentionPeriod
 *       Days: Number("int"), // required
 *     },
 *     MaximumRetention: { // MaximumRetentionPeriod
 *       Days: Number("int"), // required
 *     },
 *     EnablePermanentRetention: true || false,
 *   },
 * };
 * const command = new PutBucketProtectionConfigurationCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param PutBucketProtectionConfigurationCommandInput - {@link PutBucketProtectionConfigurationCommandInput}
 * @returns {@link PutBucketProtectionConfigurationCommandOutput}
 * @see {@link PutBucketProtectionConfigurationCommandInput} for command's `input` shape.
 * @see {@link PutBucketProtectionConfigurationCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class PutBucketProtectionConfigurationCommand extends $Command
  .classBuilder<
    PutBucketProtectionConfigurationCommandInput,
    PutBucketProtectionConfigurationCommandOutput,
    S3ClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >()
  .ep(commonParams)
  .m(function (this: any, Command: any, cs: any, config: S3ClientResolvedConfig, o: any) {
    return [
      getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
      getFlexibleChecksumsPlugin(config, {
        requestChecksumRequired: true,
      }),
    ];
  })
  .s("AmazonS3", "PutBucketProtectionConfiguration", {})
  .n("S3Client", "PutBucketProtectionConfigurationCommand")
  .sc(PutBucketProtectionConfiguration$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: PutBucketProtectionConfigurationInput;
      output: {};
    };
    sdk: {
      input: PutBucketProtectionConfigurationCommandInput;
      output: PutBucketProtectionConfigurationCommandOutput;
    };
  };
}
