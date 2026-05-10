// smithy-typescript generated code
import { getFlexibleChecksumsPlugin } from "@ibm-cos/middleware-flexible-checksums";
import { getThrow200ExceptionsPlugin } from "@ibm-cos/middleware-sdk-s3";
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { PutBucketReplicationReattemptInput, PutBucketReplicationReattemptOutput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { PutBucketReplicationReattempt$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link PutBucketReplicationReattemptCommand}.
 */
export interface PutBucketReplicationReattemptCommandInput extends PutBucketReplicationReattemptInput {}
/**
 * @public
 *
 * The output of {@link PutBucketReplicationReattemptCommand}.
 */
export interface PutBucketReplicationReattemptCommandOutput extends PutBucketReplicationReattemptOutput, __MetadataBearer {}

/**
 * <p>Triggers a reattempt of replication for a bucket.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, PutBucketReplicationReattemptCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, PutBucketReplicationReattemptCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // PutBucketReplicationReattemptInput
 *   Bucket: "STRING_VALUE", // required
 * };
 * const command = new PutBucketReplicationReattemptCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param PutBucketReplicationReattemptCommandInput - {@link PutBucketReplicationReattemptCommandInput}
 * @returns {@link PutBucketReplicationReattemptCommandOutput}
 * @see {@link PutBucketReplicationReattemptCommandInput} for command's `input` shape.
 * @see {@link PutBucketReplicationReattemptCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class PutBucketReplicationReattemptCommand extends $Command
  .classBuilder<
    PutBucketReplicationReattemptCommandInput,
    PutBucketReplicationReattemptCommandOutput,
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
      getThrow200ExceptionsPlugin(config),
    ];
  })
  .s("AmazonS3", "PutBucketReplicationReattempt", {})
  .n("S3Client", "PutBucketReplicationReattemptCommand")
  .sc(PutBucketReplicationReattempt$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: PutBucketReplicationReattemptInput;
      output: {};
    };
    sdk: {
      input: PutBucketReplicationReattemptCommandInput;
      output: PutBucketReplicationReattemptCommandOutput;
    };
  };
}
