// smithy-typescript generated code
import { getThrow200ExceptionsPlugin } from "@ibm-cos/middleware-sdk-s3";
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { GetBucketProtectionConfigurationInput, GetBucketProtectionConfigurationOutput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { GetBucketProtectionConfiguration$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link GetBucketProtectionConfigurationCommand}.
 */
export interface GetBucketProtectionConfigurationCommandInput extends GetBucketProtectionConfigurationInput {}
/**
 * @public
 *
 * The output of {@link GetBucketProtectionConfigurationCommand}.
 */
export interface GetBucketProtectionConfigurationCommandOutput extends GetBucketProtectionConfigurationOutput, __MetadataBearer {}

/**
 * <p>Gets the protection configuration for a bucket.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, GetBucketProtectionConfigurationCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, GetBucketProtectionConfigurationCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // GetBucketProtectionConfigurationInput
 *   Bucket: "STRING_VALUE", // required
 * };
 * const command = new GetBucketProtectionConfigurationCommand(input);
 * const response = await client.send(command);
 * // { // GetBucketProtectionConfigurationOutput
 * //   Status: "STRING_VALUE",
 * //   MinimumRetention: { // MinimumRetentionPeriod
 * //     Days: Number("int"), // required
 * //   },
 * //   DefaultRetention: { // DefaultRetentionPeriod
 * //     Days: Number("int"), // required
 * //   },
 * //   MaximumRetention: { // MaximumRetentionPeriod
 * //     Days: Number("int"), // required
 * //   },
 * //   EnablePermanentRetention: true || false,
 * //   IbmProtectionManagementState: "STRING_VALUE",
 * // };
 *
 * ```
 *
 * @param GetBucketProtectionConfigurationCommandInput - {@link GetBucketProtectionConfigurationCommandInput}
 * @returns {@link GetBucketProtectionConfigurationCommandOutput}
 * @see {@link GetBucketProtectionConfigurationCommandInput} for command's `input` shape.
 * @see {@link GetBucketProtectionConfigurationCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class GetBucketProtectionConfigurationCommand extends $Command
  .classBuilder<
    GetBucketProtectionConfigurationCommandInput,
    GetBucketProtectionConfigurationCommandOutput,
    S3ClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >()
  .ep(commonParams)
  .m(function (this: any, Command: any, cs: any, config: S3ClientResolvedConfig, o: any) {
    return [
      getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
      getThrow200ExceptionsPlugin(config),
    ];
  })
  .s("AmazonS3", "GetBucketProtectionConfiguration", {})
  .n("S3Client", "GetBucketProtectionConfigurationCommand")
  .sc(GetBucketProtectionConfiguration$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: GetBucketProtectionConfigurationInput;
      output: GetBucketProtectionConfigurationOutput;
    };
    sdk: {
      input: GetBucketProtectionConfigurationCommandInput;
      output: GetBucketProtectionConfigurationCommandOutput;
    };
  };
}
