// smithy-typescript generated code
import { getFlexibleChecksumsPlugin } from "@ibm-cos/middleware-flexible-checksums";
import { getThrow200ExceptionsPlugin } from "@ibm-cos/middleware-sdk-s3";
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { ListBucketReplicationFailuresInput, ListBucketReplicationFailuresOutput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { ListBucketReplicationFailures$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link ListBucketReplicationFailuresCommand}.
 */
export interface ListBucketReplicationFailuresCommandInput extends ListBucketReplicationFailuresInput {}
/**
 * @public
 *
 * The output of {@link ListBucketReplicationFailuresCommand}.
 */
export interface ListBucketReplicationFailuresCommandOutput extends ListBucketReplicationFailuresOutput, __MetadataBearer {}

/**
 * <p>Lists replication failures for a bucket with pagination and filtering.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, ListBucketReplicationFailuresCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, ListBucketReplicationFailuresCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // ListBucketReplicationFailuresInput
 *   Bucket: "STRING_VALUE", // required
 *   ContinuationToken: "STRING_VALUE",
 *   MaxKeys: Number("int"),
 *   FirstSyncAttemptedBefore: "STRING_VALUE",
 *   EncodingType: "url",
 * };
 * const command = new ListBucketReplicationFailuresCommand(input);
 * const response = await client.send(command);
 * // { // ListBucketReplicationFailuresOutput
 * //   Name: "STRING_VALUE", // required
 * //   FirstSyncAttemptedBefore: "STRING_VALUE",
 * //   MaxKeys: Number("int"),
 * //   IsTruncated: true || false, // required
 * //   EncodingType: "url",
 * //   KeyCount: Number("int"), // required
 * //   ContinuationToken: "STRING_VALUE",
 * //   NextContinuationToken: "STRING_VALUE",
 * //   Contents: [ // ReplicationFailureContentsList // required
 * //     { // ReplicationFailureEntry
 * //       Key: "STRING_VALUE", // required
 * //       VersionId: "STRING_VALUE", // required
 * //       SyncType: "STRING_VALUE", // required
 * //       FirstSyncAttempted: new Date("TIMESTAMP"), // required
 * //       LastSyncAttempted: new Date("TIMESTAMP"), // required
 * //       SyncFailureCause: "STRING_VALUE",
 * //     },
 * //   ],
 * // };
 *
 * ```
 *
 * @param ListBucketReplicationFailuresCommandInput - {@link ListBucketReplicationFailuresCommandInput}
 * @returns {@link ListBucketReplicationFailuresCommandOutput}
 * @see {@link ListBucketReplicationFailuresCommandInput} for command's `input` shape.
 * @see {@link ListBucketReplicationFailuresCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class ListBucketReplicationFailuresCommand extends $Command
  .classBuilder<
    ListBucketReplicationFailuresCommandInput,
    ListBucketReplicationFailuresCommandOutput,
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
  .s("AmazonS3", "ListBucketReplicationFailures", {})
  .n("S3Client", "ListBucketReplicationFailuresCommand")
  .sc(ListBucketReplicationFailures$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: ListBucketReplicationFailuresInput;
      output: ListBucketReplicationFailuresOutput;
    };
    sdk: {
      input: ListBucketReplicationFailuresCommandInput;
      output: ListBucketReplicationFailuresCommandOutput;
    };
  };
}
