// smithy-typescript generated code
import { createPaginator } from "@smithy/core";
import type { Paginator } from "@smithy/types";

import {
  ListBucketsExtendedCommand,
  ListBucketsExtendedCommandInput,
  ListBucketsExtendedCommandOutput,
} from "../commands/ListBucketsExtendedCommand";
import { S3Client } from "../S3Client";
import { S3PaginationConfiguration } from "./Interfaces";

/**
 * @public
 */
export const paginateListBucketsExtended: (
  config: S3PaginationConfiguration,
  input: ListBucketsExtendedCommandInput,
  ...rest: any[]
) => Paginator<ListBucketsExtendedCommandOutput> = createPaginator<
  S3PaginationConfiguration,
  ListBucketsExtendedCommandInput,
  ListBucketsExtendedCommandOutput
>(S3Client, ListBucketsExtendedCommand, "Marker", "NextMarker", "MaxKeys");
