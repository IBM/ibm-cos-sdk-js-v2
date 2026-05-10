import { describe, test as it, expect } from "vitest";

import { S3Client } from "ibm-cos-sdk-v2";
import { LambdaClient } from "@ibm-cos/client-lambda";
import { EMRClient } from "@ibm-cos/client-emr";
import { SageMakerClient } from "@ibm-cos/client-sagemaker";
import { CloudWatchClient } from "@ibm-cos/client-cloudwatch";
import { STSClient } from "@ibm-cos/client-sts";
import { DynamoDBClient } from "@ibm-cos/client-dynamodb";
import { CloudFormationClient } from "@ibm-cos/client-cloudformation";
import { SFNClient } from "@ibm-cos/client-sfn";

const clients = [
  new S3Client(),
  new LambdaClient(),
  new EMRClient(),
  new SageMakerClient(),
  new CloudFormationClient(),
  new CloudWatchClient(),
  new STSClient(),
  new DynamoDBClient(),
  new SFNClient(),
];

const serviceIds = [
  "S3",
  "Lambda",
  "EMR",
  "SageMaker",
  "CloudFormation",
  "CloudWatch",
  "STS",
  "DynamoDB",
  "SFN",
] as string[];

describe("service ids (various clients)", () => {
  for (const [i, client] of Object.entries(clients)) {
    it("should have a service id matching its class name", () => {
      const index = parseInt(i);

      expect(client.config.serviceId).toEqual(serviceIds[index]);
      expect(client.constructor.name.replace(/Client$/, "")).toEqual(serviceIds[index]);
    });
  }
});
