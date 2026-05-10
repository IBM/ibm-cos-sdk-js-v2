// smithy-typescript generated code
import { getThrow200ExceptionsPlugin } from "@ibm-cos/middleware-sdk-s3";
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { ListLegalHoldsInput, ListLegalHoldsOutput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { ListLegalHolds$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link ListLegalHoldsCommand}.
 */
export interface ListLegalHoldsCommandInput extends ListLegalHoldsInput {}
/**
 * @public
 *
 * The output of {@link ListLegalHoldsCommand}.
 */
export interface ListLegalHoldsCommandOutput extends ListLegalHoldsOutput, __MetadataBearer {}

/**
 * <p>Lists legal holds for an object.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, ListLegalHoldsCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, ListLegalHoldsCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // ListLegalHoldsInput
 *   Bucket: "STRING_VALUE", // required
 *   Key: "STRING_VALUE", // required
 *   MirrorDestination: "STRING_VALUE",
 * };
 * const command = new ListLegalHoldsCommand(input);
 * const response = await client.send(command);
 * // { // ListLegalHoldsOutput
 * //   CreateTime: new Date("TIMESTAMP"),
 * //   LegalHolds: [ // LegalHoldList
 * //     { // LegalHoldEntry
 * //       Date: new Date("TIMESTAMP"),
 * //       ID: "STRING_VALUE",
 * //     },
 * //   ],
 * //   RetentionPeriod: Number("int"),
 * //   RetentionPeriodExpirationDate: new Date("TIMESTAMP"),
 * // };
 *
 * ```
 *
 * @param ListLegalHoldsCommandInput - {@link ListLegalHoldsCommandInput}
 * @returns {@link ListLegalHoldsCommandOutput}
 * @see {@link ListLegalHoldsCommandInput} for command's `input` shape.
 * @see {@link ListLegalHoldsCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class ListLegalHoldsCommand extends $Command
  .classBuilder<
    ListLegalHoldsCommandInput,
    ListLegalHoldsCommandOutput,
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
  .s("AmazonS3", "ListLegalHolds", {})
  .n("S3Client", "ListLegalHoldsCommand")
  .sc(ListLegalHolds$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: ListLegalHoldsInput;
      output: ListLegalHoldsOutput;
    };
    sdk: {
      input: ListLegalHoldsCommandInput;
      output: ListLegalHoldsCommandOutput;
    };
  };
}
