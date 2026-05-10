import { S3 } from "ibm-cos-sdk-v2";
import { fromNodeProviderChain } from "@ibm-cos/credential-providers";
import { describe, expect, test as it } from "vitest";

import { CTest } from "./_test-lib";

describe(fromNodeProviderChain.name, () => {
  const ctest = new CTest({
    credentialProvider: fromNodeProviderChain,
    providerParams: CTest.defaultRegionConfigProvider,
    profileCredentials: true,
    fallbackRegion: "us-east-1",
  });

  ctest.testRegion();

  void S3;

  it("is tested in the credential-provider-node.integ.spec.ts file", async () => {
    expect("ok").toBeTruthy();
  });
});
