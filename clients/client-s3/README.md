# IBM Cloud Object Storage - Node.js SDK v2

Welcome to the Node.js SDK v2 Beta. This release is an early version of our SDK and is intended for testing and feedback purposes.

This package allows Node.js developers to write software that interacts with [IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage).
It is a fork of the [AWS SDK for JS v3](https://github.com/aws/aws-sdk-js-v3) library and can stand as a drop-in replacement for applications that use S3-compatible APIs and do not depend on other AWS services.

***

## Important Notes

This is a **beta release** - APIs may change before the GA release, and use in production environments is **not recommended** at this time.

***

## Feedback & Issue Reporting

We value your feedback! Please report any bugs or issues in the [GitHub Issues](https://github.ibm.com/cos-clevos/ibm-cos-sdk-js-v2/issues/new) section.
Suggestions for enhancements and reports of unexpected behavior are welcome.

***

## Notice

IBM has added a [Language Support Policy](#language-support-policy).
Language versions will be deprecated on the published schedule without additional notice.

***

## Documentation

* [Code Examples](../../examples/)
* [REST API reference documentation](https://cloud.ibm.com/docs/cloud-object-storage/api-reference/about-api.html?group=api-reference)

For release notes, see the [CHANGELOG](CHANGELOG.md).

* [Getting the SDK](#getting-the-sdk)
* [Example code](#example-code)
* [Getting help](#getting-help)

***

## Quick Start

You'll need:

* An [IBM Cloud](https://cloud.ibm.com/registration) account.
* An instance of IBM Cloud Object Storage (COS).
* An IAM API key from [IBM Cloud API keys page](https://cloud.ibm.com/iam/apikeys) with at least `Writer` permissions.
* The service instance ID of your COS instance.
* IAM Token endpoint.
* Service endpoint.

These values can be found in the IBM Cloud UI by [generating a service credential](https://cloud.ibm.com/docs/services/cloud-object-storage/iam?topic=cloud-object-storage-service-credentials#service-credentials).

***

## Archive Tier Support

You can automatically archive objects after a specified length of time or after a specified date.
Once archived, a temporary copy of an object can be restored for access as needed. Restore time may take up to 15 hours.

An archive policy is set at the bucket level by calling the ``PutBucketLifecycleConfiguration`` method on a client instance.
A newly added or modified archive policy applies to new objects uploaded and does not affect existing objects.
For more detail, see the [IBM Cloud documentation](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-node).

## Accelerated Archive

Users can set an archive rule that would allow data restore from an archive in 2 hours or 12 hours.

***

## Immutable Object Storage

Users can configure buckets with an Immutable Object Storage policy to prevent objects from being modified or deleted for a defined period of time.
The retention period can be specified on a per-object basis, or objects can inherit a default retention period set on the bucket.
It is also possible to set open-ended and permanent retention periods.
Immutable Object Storage meets the rules set forth by the SEC governing record retention, and IBM Cloud administrators are unable to bypass these restrictions.
For more detail, see the [IBM Cloud documentation](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-node).

Note: Immutable Object Storage does not support Aspera transfers via the SDK to upload objects or directories at this stage.

***

## Getting the SDK

The preferred way to install the IBM COS SDK for Node.js is to use the
[npm](https://www.npmjs.com) package manager for Node.js. Simply type the following
into a terminal window:

```sh
npm install ibm-cos-sdk-v2
```

### Example Code

The following example demonstrates how to create a bucket using IAM authentication in IBM Cloud Object Storage using the v2 SDK and S3-compatible APIs.  
The SDK requires a minimum version of Node.js 18 or newer.

```js
const { S3Client, CreateBucketCommand } = require('ibm-cos-sdk-v2');

async function createBucket() {
  try {
    // Initialize client
    const client = new S3Client({
      endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
      region: 'us-south',
      credentials: {
        apiKey: API_KEY,
        serviceInstanceId: SERVICE_INSTANCE_ID,
      },
    });

    // Create bucket
    console.log('Creating bucket: ' + BUCKET_NAME);
    
    const command = new CreateBucketCommand({
      Bucket: BUCKET_NAME
    });

    await client.send(command);
    
    console.log('Bucket created successfully');
  } catch (error) {
    console.error('Error: ' + error.message);
    process.exit(1);
  }
}
```

### Compile and run

```sh
node BucketCreate.js
```

More examples can be found in [example directory](../../examples).

***

## Getting Help

Feel free to use GitHub issues for tracking bugs and feature requests, but for help please use one of the following resources:

* Read a quick start guide in [IBM Cloud Docs](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-node).
* Ask a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/object-storage+ibm) and tag it with `ibm` and `object-storage`.
* Open a support ticket with [IBM Cloud Support](https://cloud.ibm.com/unifiedsupport/supportcenter/)
* If it turns out that you may have found a bug, please [open an issue](https://github.ibm.com/cos-clevos/ibm-cos-sdk-js-v2/issues/new).

***

## Language Support Policy

IBM supports [current LTS releases](https://nodejs.org/en/about/previous-releases).
IBM will deprecate language versions 90 days after a version reaches end-of-life. All clients will need to upgrade to a supported version before the end of the grace period.

## License

This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE.txt and NOTICE.txt for more information.
