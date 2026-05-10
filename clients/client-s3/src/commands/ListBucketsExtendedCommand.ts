// smithy-typescript generated code
import { getThrow200ExceptionsPlugin } from "@ibm-cos/middleware-sdk-s3";
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { ListBucketsExtendedInput, ListBucketsExtendedOutput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { ListBucketsExtended$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link ListBucketsExtendedCommand}.
 */
export interface ListBucketsExtendedCommandInput extends ListBucketsExtendedInput {}
/**
 * @public
 *
 * The output of {@link ListBucketsExtendedCommand}.
 */
export interface ListBucketsExtendedCommandOutput extends ListBucketsExtendedOutput, __MetadataBearer {}

/**
 * <p>Lists buckets with extended filtering and pagination.</p>
 * <p>Alias in original model: "GetServiceExtended"</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, ListBucketsExtendedCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, ListBucketsExtendedCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // ListBucketsExtendedInput
 *   IBMServiceInstanceId: "STRING_VALUE",
 *   Marker: "STRING_VALUE",
 *   MaxKeys: Number("int"),
 *   Prefix: "STRING_VALUE",
 * };
 * const command = new ListBucketsExtendedCommand(input);
 * const response = await client.send(command);
 * // { // ListBucketsExtendedOutput
 * //   IsTruncated: true || false,
 * //   Marker: "STRING_VALUE",
 * //   NextMarker: "STRING_VALUE",
 * //   Buckets: [ // Buckets
 * //     { // Bucket
 * //       Name: "STRING_VALUE",
 * //       CreationDate: new Date("TIMESTAMP"),
 * //       BucketRegion: "STRING_VALUE",
 * //       BucketArn: "STRING_VALUE",
 * //     },
 * //   ],
 * //   Owner: { // Owner
 * //     DisplayName: "STRING_VALUE",
 * //     ID: "STRING_VALUE",
 * //   },
 * // };
 *
 * ```
 *
 * @param ListBucketsExtendedCommandInput - {@link ListBucketsExtendedCommandInput}
 * @returns {@link ListBucketsExtendedCommandOutput}
 * @see {@link ListBucketsExtendedCommandInput} for command's `input` shape.
 * @see {@link ListBucketsExtendedCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class ListBucketsExtendedCommand extends $Command
  .classBuilder<
    ListBucketsExtendedCommandInput,
    ListBucketsExtendedCommandOutput,
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
  .s("AmazonS3", "ListBucketsExtended", {})
  .n("S3Client", "ListBucketsExtendedCommand")
  .sc(ListBucketsExtended$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: ListBucketsExtendedInput;
      output: ListBucketsExtendedOutput;
    };
    sdk: {
      input: ListBucketsExtendedCommandInput;
      output: ListBucketsExtendedCommandOutput;
    };
  };
}
