// smithy-typescript generated code
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { AddLegalHoldInput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { AddLegalHold$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link AddLegalHoldCommand}.
 */
export interface AddLegalHoldCommandInput extends AddLegalHoldInput {}
/**
 * @public
 *
 * The output of {@link AddLegalHoldCommand}.
 */
export interface AddLegalHoldCommandOutput extends __MetadataBearer {}

/**
 * <p>Adds a legal hold to an object.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, AddLegalHoldCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, AddLegalHoldCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // AddLegalHoldInput
 *   Bucket: "STRING_VALUE", // required
 *   Key: "STRING_VALUE", // required
 *   RetentionLegalHoldId: "STRING_VALUE", // required
 * };
 * const command = new AddLegalHoldCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param AddLegalHoldCommandInput - {@link AddLegalHoldCommandInput}
 * @returns {@link AddLegalHoldCommandOutput}
 * @see {@link AddLegalHoldCommandInput} for command's `input` shape.
 * @see {@link AddLegalHoldCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class AddLegalHoldCommand extends $Command
  .classBuilder<
    AddLegalHoldCommandInput,
    AddLegalHoldCommandOutput,
    S3ClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >()
  .ep(commonParams)
  .m(function (this: any, Command: any, cs: any, config: S3ClientResolvedConfig, o: any) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
  })
  .s("AmazonS3", "AddLegalHold", {})
  .n("S3Client", "AddLegalHoldCommand")
  .sc(AddLegalHold$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: AddLegalHoldInput;
      output: {};
    };
    sdk: {
      input: AddLegalHoldCommandInput;
      output: AddLegalHoldCommandOutput;
    };
  };
}
