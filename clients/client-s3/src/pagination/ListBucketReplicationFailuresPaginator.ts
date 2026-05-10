// smithy-typescript generated code
import { createPaginator } from "@smithy/core";
import type { Paginator } from "@smithy/types";

import {
  ListBucketReplicationFailuresCommand,
  ListBucketReplicationFailuresCommandInput,
  ListBucketReplicationFailuresCommandOutput,
} from "../commands/ListBucketReplicationFailuresCommand";
import { S3Client } from "../S3Client";
import { S3PaginationConfiguration } from "./Interfaces";

/**
 * @public
 */
export const paginateListBucketReplicationFailures: (
  config: S3PaginationConfiguration,
  input: ListBucketReplicationFailuresCommandInput,
  ...rest: any[]
) => Paginator<ListBucketReplicationFailuresCommandOutput> = createPaginator<
  S3PaginationConfiguration,
  ListBucketReplicationFailuresCommandInput,
  ListBucketReplicationFailuresCommandOutput
>(S3Client, ListBucketReplicationFailuresCommand, "ContinuationToken", "NextContinuationToken", "MaxKeys");
