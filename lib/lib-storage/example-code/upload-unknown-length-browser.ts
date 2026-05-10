import { fromCognitoIdentityPool } from "@ibm-cos/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@ibm-cos/client-cognito-identity";

import { S3Client } from "ibm-cos-sdk-v2";
import { Upload } from "@ibm-cos/lib-storage";

import { configuration } from "./config";

const idPool = "us-west-2:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const Bucket = configuration.Bucket;
const region = "us-west-2";

const sleep = async (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const fakeStreamOfUnknownlength = new ReadableStream({
  start: async (controller) => {
    for (let index = 0; index < 8; index++) {
      const time = Math.random() * 5;
      await sleep(time);
      console.log(`Delaying part ${index} for ${time}`);
      controller.enqueue(`[part ${index}] with ${"#".repeat(2000000)}`);
    }
    controller.close();
  },
});

const uploadIndeterminateLengthStreamBrowser = async () => {
  const client = new S3Client({
    region,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId: idPool,
    }),
  });

  const Key = configuration.Key;

  let upload = new Upload({
    client,
    params: {
      Key,
      Bucket,
      Body: fakeStreamOfUnknownlength,
    },
  });

  upload.on("httpUploadProgress", (progress: ProgressEvent) => {
    console.log(progress);
  });

  const uploadResult = await upload.done();
  console.log("done uploading", uploadResult);
};

uploadIndeterminateLengthStreamBrowser();
