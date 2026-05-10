import { S3Client } from "ibm-cos-sdk-v2";
import { Upload } from "@ibm-cos/lib-storage";

import { Readable } from "stream";
import { configuration } from "./config";

const Bucket = configuration.Bucket;
const region = "us-west-2";

const sleep = async (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

async function* generateContents() {
  for (let index = 0; index < 8; index++) {
    const time = Math.random() * 10;
    await sleep(time);
    console.log(`Delaying part ${index} for ${time}`);
    yield `[Part ${index}] ${"#".repeat(2000000)}`;
  }
}
const fakeStreamOfUnknownlength = Readable.from(generateContents());

const uploadIndeterminateLengthStreamNode = async () => {
  const Key = configuration.Key;
  let upload = new Upload({
    client: new S3Client({ region }),
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

uploadIndeterminateLengthStreamNode();
