// smithy-typescript generated code
import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import type { MetadataBearer as __MetadataBearer } from "@smithy/types";

import { commonParams } from "../endpoint/EndpointParameters";
import type { DeleteLegalHoldInput } from "../models/models_0";
import type { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../S3Client";
import { DeleteLegalHold$ } from "../schemas/schemas_0";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link DeleteLegalHoldCommand}.
 */
export interface DeleteLegalHoldCommandInput extends DeleteLegalHoldInput {}
/**
 * @public
 *
 * The output of {@link DeleteLegalHoldCommand}.
 */
export interface DeleteLegalHoldCommandOutput extends __MetadataBearer {}

/**
 * <p>Deletes a legal hold from an object.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { S3Client, DeleteLegalHoldCommand } from "ibm-cos-sdk-v2"; // ES Modules import
 * // const { S3Client, DeleteLegalHoldCommand } = require("ibm-cos-sdk-v2"); // CommonJS import
 * // import type { S3ClientConfig } from "ibm-cos-sdk-v2";
 * const config = {}; // type is S3ClientConfig
 * const client = new S3Client(config);
 * const input = { // DeleteLegalHoldInput
 *   Bucket: "STRING_VALUE", // required
 *   Key: "STRING_VALUE", // required
 *   RetentionLegalHoldId: "STRING_VALUE", // required
 * };
 * const command = new DeleteLegalHoldCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param DeleteLegalHoldCommandInput - {@link DeleteLegalHoldCommandInput}
 * @returns {@link DeleteLegalHoldCommandOutput}
 * @see {@link DeleteLegalHoldCommandInput} for command's `input` shape.
 * @see {@link DeleteLegalHoldCommandOutput} for command's `response` shape.
 * @see {@link S3ClientResolvedConfig | config} for S3Client's `config` shape.
 *
 * @throws {@link S3ServiceException}
 * <p>Base exception class for all service exceptions from S3 service.</p>
 *
 *
 * @public
 */
export class DeleteLegalHoldCommand extends $Command
  .classBuilder<
    DeleteLegalHoldCommandInput,
    DeleteLegalHoldCommandOutput,
    S3ClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >()
  .ep(commonParams)
  .m(function (this: any, Command: any, cs: any, config: S3ClientResolvedConfig, o: any) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
  })
  .s("AmazonS3", "DeleteLegalHold", {})
  .n("S3Client", "DeleteLegalHoldCommand")
  .sc(DeleteLegalHold$)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: DeleteLegalHoldInput;
      output: {};
    };
    sdk: {
      input: DeleteLegalHoldCommandInput;
      output: DeleteLegalHoldCommandOutput;
    };
  };
}
