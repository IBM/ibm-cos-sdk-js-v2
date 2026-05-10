# IBM Cloud Object Storage SDK for Node.js: Migration Guide (v1 to v2)

## Introduction

This migration guide helps developers transition from the IBM Cloud Object Storage SDK for JavaScript v1 to the new IBM COS SDK for JavaScript v2. The v2 SDK is a modernized, modular, and extensible rewrite built on the AWS SDK for JavaScript v3 architecture.

Developers familiar with AWS SDK v3 patterns will find the new IBM COS v2 structure intuitive. Applications written using the original v1 API may require updates in client construction, request/response models, authentication, error handling, and operational patterns.

## Table of Contents

- [IBM Cloud Object Storage SDK for Node.js: Migration Guide (v1 to v2)](#ibm-cloud-object-storage-sdk-for-nodejs-migration-guide-v1-to-v2)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Understanding the Migration](#understanding-the-migration)
    - [Why a New SDK Version?](#why-a-new-sdk-version)
    - [Key Benefits of v2](#key-benefits-of-v2)
    - [Overview of Migration Steps](#overview-of-migration-steps)
  - [Project Setup](#project-setup)
    - [Node.js Version Requirements](#nodejs-version-requirements)
    - [Package Installation](#package-installation)
    - [Updating Dependencies](#updating-dependencies)
  - [Configuring Service Clients](#configuring-service-clients)
    - [Creating a Service Client](#creating-a-service-client)
      - [Client Configuration in v1](#client-configuration-in-v1)
      - [Client Configuration in v2](#client-configuration-in-v2)
    - [Modular Imports](#modular-imports)
  - [Authentication and Credentials](#authentication-and-credentials)
    - [IAM Authentication](#iam-authentication)
    - [HMAC Credentials](#hmac-credentials)
    - [Service Credentials](#service-credentials)
  - [API Operation Changes](#api-operation-changes)
    - [Command Pattern](#command-pattern)
    - [Request and Response Models](#request-and-response-models)
    - [Async Operations](#async-operations)
  - [Bucket Operations](#bucket-operations)
    - [Create Bucket](#create-bucket)
    - [List Buckets](#list-buckets)
    - [Delete Bucket](#delete-bucket)
    - [Head Bucket](#head-bucket)
  - [Object Operations](#object-operations)
    - [Put Object](#put-object)
    - [Get Object](#get-object)
    - [Delete Object](#delete-object)
    - [Delete Multiple Objects](#delete-multiple-objects)
    - [Head Object](#head-object)
    - [Copy Object](#copy-object)
  - [Streaming Operations](#streaming-operations)
    - [Streaming Upload](#streaming-upload)
    - [Streaming Download](#streaming-download)
  - [Multipart Upload](#multipart-upload)
    - [Manual Multipart Upload](#manual-multipart-upload)
    - [Using Upload Manager](#using-upload-manager)
  - [Pagination](#pagination)
    - [List Objects V2](#list-objects-v2)
  - [Presigned URLs](#presigned-urls)
    - [Generate Presigned GET URL](#generate-presigned-get-url)
    - [Generate Presigned PUT URL](#generate-presigned-put-url)
  - [Error Handling](#error-handling)
    - [Error Structure Changes](#error-structure-changes)
    - [Common Error Types](#common-error-types)
  - [Access Control Lists (ACL)](#access-control-lists-acl)
    - [Bucket ACL](#bucket-acl)
    - [Object ACL](#object-acl)
    - [Canned ACL](#canned-acl)
  - [Metadata and Tagging](#metadata-and-tagging)
    - [Object Metadata](#object-metadata)
    - [Bucket Tagging](#bucket-tagging)
    - [Object Tagging](#object-tagging)
    - [Put CORS Configuration](#put-cors-configuration)
    - [Get CORS Configuration](#get-cors-configuration)
  - [Lifecycle Configuration](#lifecycle-configuration)
    - [Set Lifecycle Configuration](#set-lifecycle-configuration)
  - [IBM-Specific Features](#ibm-specific-features)
    - [Bucket Protection (WORM)](#bucket-protection-worm)
      - [Set Bucket Protection](#set-bucket-protection)
      - [Get Bucket Protection](#get-bucket-protection)
    - [Legal Hold](#legal-hold)
      - [Add Legal Hold](#add-legal-hold)
      - [List Legal Holds](#list-legal-holds)
      - [Delete Legal Hold](#delete-legal-hold)
    - [Key Protect Integration](#key-protect-integration)
  - [Waiters](#waiters)
    - [Wait for Bucket to Exist](#wait-for-bucket-to-exist)
    - [Wait for Object to Exist](#wait-for-object-to-exist)
  - [Best Practices](#best-practices)
    - [Reuse Service Clients](#reuse-service-clients)
    - [Handle Streams Properly](#handle-streams-properly)
    - [Configure Timeouts](#configure-timeouts)
    - [Use Appropriate Part Sizes](#use-appropriate-part-sizes)
  - [Troubleshooting](#troubleshooting)
    - [Common Migration Issues](#common-migration-issues)
      - [Issue: Module Not Found](#issue-module-not-found)
      - [Issue: Authentication Failures](#issue-authentication-failures)
      - [Issue: Stream Handling Errors](#issue-stream-handling-errors)
      - [Issue: Timeout Errors](#issue-timeout-errors)
    - [Debugging Tips](#debugging-tips)
  - [Comparison Table](#comparison-table)
  - [Conclusion](#conclusion)

---

## Understanding the Migration

### Why a New SDK Version?

IBM Cloud Object Storage SDK for JavaScript v1 was based on the AWS SDK for JavaScript v2 architecture. While functional, the v1 SDK had several limitations:

- **Monolithic package structure** - The entire SDK was bundled together, leading to large bundle sizes
- **Callback-based patterns** - Primary API relied on callbacks, making async code harder to manage
- **Limited tree-shaking** - Difficult to eliminate unused code in modern bundlers
- **Manual credential management** - IAM token refresh required manual implementation
- **Older JavaScript patterns** - Did not leverage modern ES6+ features

The new IBM COS SDK for JavaScript v2 brings significant improvements:

- **Modular architecture** - Import only the commands and clients you need
- **Promise-first design** - Native async/await support with cleaner error handling
- **Smaller bundle sizes** - Tree-shakeable modules reduce application size
- **Automatic credential refresh** - Built-in IAM token management
- **Modern JavaScript** - Leverages ES6+ features and TypeScript support
- **Middleware stack** - Extensible request/response pipeline
- **Better error handling** - Structured error types with detailed information

### Key Benefits of v2

1. **Reduced Bundle Size**: Modular imports can reduce bundle size by 80% or more
2. **Better Performance**: Optimized HTTP client and connection pooling
3. **Improved Developer Experience**: TypeScript definitions, better IDE support
4. **Future-Proof**: Aligned with AWS SDK v3 for long-term compatibility
5. **Enhanced Security**: Automatic credential rotation and secure defaults

### Overview of Migration Steps

1. **Update Dependencies**: Replace `ibm-cos-sdk` with `ibm-cos-sdk-v2`
2. **Refactor Imports**: Change from monolithic imports to modular command imports
3. **Update Client Initialization**: Migrate from constructor-based to configuration-based setup
4. **Convert API Calls**: Replace method calls with command pattern
5. **Update Error Handling**: Adapt to new error structure
6. **Test Thoroughly**: Verify all operations work as expected

---

## Project Setup

### Node.js Version Requirements

The IBM COS SDK for JavaScript v2 requires:

- **Node.js 14.x or later** (Node.js 18.x or later recommended)
- **npm 6.x or later** or **yarn 1.22.x or later**

Check your Node.js version:

```bash
node --version
```

### Package Installation

#### IBM COS v1

```bash
npm install ibm-cos-sdk
```

#### IBM COS v2

```bash
npm install ibm-cos-sdk-v2
```

For multipart upload functionality:

```bash
npm install @ibm-cos/lib-storage
```

For presigned URL generation:

```bash
npm install @ibm-cos/s3-request-presigner
```

### Updating Dependencies

Update your `package.json`:

```json
{
  "dependencies": {
    "ibm-cos-sdk-v2": "^3.x.x",
    "@ibm-cos/lib-storage": "^3.x.x",
    "@ibm-cos/s3-request-presigner": "^3.x.x"
  }
}
```

Remove the v1 SDK:

```bash
npm uninstall ibm-cos-sdk
```

Install v2 dependencies:

```bash
npm install
```

---

## Configuring Service Clients

### Creating a Service Client

#### Client Configuration in v1

```javascript
const IBM = require('ibm-cos-sdk');

const config = {
  endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
  apiKeyId: 'YOUR_API_KEY',
  serviceInstanceId: 'YOUR_SERVICE_INSTANCE_ID'
};

const cos = new IBM.S3(config);
```

#### Client Configuration in v2

```javascript
const { S3Client } = require('ibm-cos-sdk-v2');

const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  credentials: {
    accessKeyId: 'YOUR_API_KEY',
    secretAccessKey: 'YOUR_SERVICE_INSTANCE_ID'
  }
});
```

### Modular Imports

#### v1 Import Pattern

```javascript
// v1 - Imports entire SDK
const IBM = require('ibm-cos-sdk');
const cos = new IBM.S3(config);
```

#### v2 Import Pattern

```javascript
// v2 - Import only what you need
const { S3Client, ListBucketsCommand, PutObjectCommand } = require('ibm-cos-sdk-v2');

const client = new S3Client(config);
```

**TypeScript Example:**

```typescript
import { S3Client, ListBucketsCommand, PutObjectCommand } from 'ibm-cos-sdk-v2';

const client = new S3Client(config);
```

---

## Authentication and Credentials

### IAM Authentication

#### v1 IAM Configuration

```javascript
const IBM = require('ibm-cos-sdk');

const config = {
  endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
  apiKeyId: 'YOUR_API_KEY',
  serviceInstanceId: 'YOUR_SERVICE_INSTANCE_ID',
  signatureVersion: 'iam'
};

const cos = new IBM.S3(config);
```

#### v2 IAM Configuration

```javascript
const { S3Client } = require('ibm-cos-sdk-v2');
const { fromIni } = require('@ibm-cos/credential-providers');

// Option 1: Direct credentials
const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  credentials: {
    accessKeyId: 'YOUR_API_KEY',
    secretAccessKey: 'YOUR_SERVICE_INSTANCE_ID'
  }
});

// Option 2: From environment variables
// Set IBM_API_KEY_ID and IBM_SERVICE_INSTANCE_ID
const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud'
});

// Option 3: From shared credentials file
const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  credentials: fromIni({ profile: 'default' })
});
```

### HMAC Credentials

#### v1 HMAC Configuration

```javascript
const IBM = require('ibm-cos-sdk');

const config = {
  endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
};

const cos = new IBM.S3(config);
```

#### v2 HMAC Configuration

```javascript
const { S3Client } = require('ibm-cos-sdk-v2');

const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
  }
});
```

### Service Credentials

Both v1 and v2 support loading credentials from the IBM Cloud service credentials file located at `~/.bluemix/cos_credentials`. The SDK will automatically detect and use these credentials if no explicit credentials are provided.

---

## API Operation Changes

### Command Pattern

The v2 SDK uses a command pattern where each operation is represented by a command class.

**v1 Pattern:**

```javascript
cos.listBuckets((err, data) => {
  if (err) console.error(err);
  else console.log(data);
});
```

**v2 Pattern:**

```javascript
const { ListBucketsCommand } = require('ibm-cos-sdk-v2');

const command = new ListBucketsCommand({});
const response = await client.send(command);
console.log(response);
```

### Request and Response Models

In v2, all request parameters are passed to the command constructor, and responses are returned directly from the `send()` method.

**v1:**

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object'
};

cos.getObject(params, (err, data) => {
  if (err) console.error(err);
  else console.log(data);
});
```

**v2:**

```javascript
const { GetObjectCommand } = require('ibm-cos-sdk-v2');

const command = new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'my-object'
});

const response = await client.send(command);
console.log(response);
```

### Async Operations

#### v1 Promise Pattern

```javascript
cos.listBuckets()
  .promise()
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### v2 Async/Await Pattern

```javascript
const { ListBucketsCommand } = require('ibm-cos-sdk-v2');

try {
  const command = new ListBucketsCommand({});
  const response = await client.send(command);
  console.log(response);
} catch (err) {
  console.error(err);
}
```

---

## Bucket Operations

### Create Bucket

#### v1 Example

```javascript
const params = {
  Bucket: 'my-new-bucket',
  CreateBucketConfiguration: {
    LocationConstraint: 'us-south-standard'
  }
};

cos.createBucket(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Bucket created successfully');
});
```

#### v2 Example

```javascript
const { CreateBucketCommand } = require('ibm-cos-sdk-v2');

const command = new CreateBucketCommand({
  Bucket: 'my-new-bucket',
  CreateBucketConfiguration: {
    LocationConstraint: 'us-south-standard'
  }
});

try {
  const response = await client.send(command);
  console.log('Bucket created successfully');
} catch (err) {
  console.error('Error creating bucket:', err);
}
```

### List Buckets

#### v1 Example

```javascript
cos.listBuckets((err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Buckets:', data.Buckets);
  }
});
```

#### v2 Example

```javascript
const { ListBucketsCommand } = require('ibm-cos-sdk-v2');

try {
  const command = new ListBucketsCommand({});
  const response = await client.send(command);
  console.log('Buckets:', response.Buckets);
} catch (err) {
  console.error('Error listing buckets:', err);
}
```

### Delete Bucket

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket'
};

cos.deleteBucket(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Bucket deleted successfully');
});
```

#### v2 Example

```javascript
const { DeleteBucketCommand } = require('ibm-cos-sdk-v2');

const command = new DeleteBucketCommand({
  Bucket: 'my-bucket'
});

try {
  await client.send(command);
  console.log('Bucket deleted successfully');
} catch (err) {
  console.error('Error deleting bucket:', err);
}
```

### Head Bucket

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket'
};

cos.headBucket(params, (err, data) => {
  if (err) console.error('Bucket does not exist');
  else console.log('Bucket exists');
});
```

#### v2 Example

```javascript
const { HeadBucketCommand } = require('ibm-cos-sdk-v2');

const command = new HeadBucketCommand({
  Bucket: 'my-bucket'
});

try {
  await client.send(command);
  console.log('Bucket exists');
} catch (err) {
  if (err.name === 'NotFound') {
    console.log('Bucket does not exist');
  } else {
    console.error('Error checking bucket:', err);
  }
}
```

---

## Object Operations

### Put Object

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  Body: 'Hello, World!'
};

cos.putObject(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Object uploaded successfully');
});
```

#### v2 Example

```javascript
const { PutObjectCommand } = require('ibm-cos-sdk-v2');

const command = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  Body: 'Hello, World!'
});

try {
  const response = await client.send(command);
  console.log('Object uploaded successfully');
  console.log('ETag:', response.ETag);
} catch (err) {
  console.error('Error uploading object:', err);
}
```

### Get Object

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt'
};

cos.getObject(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Object content:', data.Body.toString('utf-8'));
  }
});
```

#### v2 Example

```javascript
const { GetObjectCommand } = require('ibm-cos-sdk-v2');

const command = new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt'
});

try {
  const response = await client.send(command);
  const bodyContents = await response.Body.transformToString();
  console.log('Object content:', bodyContents);
} catch (err) {
  console.error('Error getting object:', err);
}
```

### Delete Object

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt'
};

cos.deleteObject(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Object deleted successfully');
});
```

#### v2 Example

```javascript
const { DeleteObjectCommand } = require('ibm-cos-sdk-v2');

const command = new DeleteObjectCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt'
});

try {
  await client.send(command);
  console.log('Object deleted successfully');
} catch (err) {
  console.error('Error deleting object:', err);
}
```

### Delete Multiple Objects

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Delete: {
    Objects: [
      { Key: 'object1.txt' },
      { Key: 'object2.txt' },
      { Key: 'object3.txt' }
    ]
  }
};

cos.deleteObjects(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Objects deleted:', data.Deleted);
});
```

#### v2 Example

```javascript
const { DeleteObjectsCommand } = require('ibm-cos-sdk-v2');

const command = new DeleteObjectsCommand({
  Bucket: 'my-bucket',
  Delete: {
    Objects: [
      { Key: 'object1.txt' },
      { Key: 'object2.txt' },
      { Key: 'object3.txt' }
    ]
  }
});

try {
  const response = await client.send(command);
  console.log('Objects deleted:', response.Deleted);
} catch (err) {
  console.error('Error deleting objects:', err);
}
```

### Head Object

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt'
};

cos.headObject(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Object metadata:', data);
  }
});
```

#### v2 Example

```javascript
const { HeadObjectCommand } = require('ibm-cos-sdk-v2');

const command = new HeadObjectCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt'
});

try {
  const response = await client.send(command);
  console.log('Object metadata:', response);
  console.log('Content-Type:', response.ContentType);
  console.log('Content-Length:', response.ContentLength);
} catch (err) {
  console.error('Error getting object metadata:', err);
}
```

### Copy Object

#### v1 Example

```javascript
const params = {
  Bucket: 'destination-bucket',
  CopySource: '/source-bucket/source-object.txt',
  Key: 'destination-object.txt'
};

cos.copyObject(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Object copied successfully');
});
```

#### v2 Example

```javascript
const { CopyObjectCommand } = require('ibm-cos-sdk-v2');

const command = new CopyObjectCommand({
  Bucket: 'destination-bucket',
  CopySource: '/source-bucket/source-object.txt',
  Key: 'destination-object.txt'
});

try {
  const response = await client.send(command);
  console.log('Object copied successfully');
  console.log('Copy ETag:', response.CopyObjectResult.ETag);
} catch (err) {
  console.error('Error copying object:', err);
}
```

---

## Streaming Operations

### Streaming Upload

#### v1 Example

```javascript
const fs = require('fs');

const fileStream = fs.createReadStream('large-file.bin');

const params = {
  Bucket: 'my-bucket',
  Key: 'large-file.bin',
  Body: fileStream
};

cos.putObject(params, (err, data) => {
  if (err) console.error(err);
  else console.log('File uploaded successfully');
});
```

#### v2 Example

```javascript
const fs = require('fs');
const { PutObjectCommand } = require('ibm-cos-sdk-v2');

const fileStream = fs.createReadStream('large-file.bin');

const command = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'large-file.bin',
  Body: fileStream
});

try {
  const response = await client.send(command);
  console.log('File uploaded successfully');
} catch (err) {
  console.error('Error uploading file:', err);
}
```

### Streaming Download

#### v1 Example

```javascript
const fs = require('fs');

const params = {
  Bucket: 'my-bucket',
  Key: 'large-file.bin'
};

const fileStream = fs.createWriteStream('downloaded-file.bin');

cos.getObject(params)
  .createReadStream()
  .pipe(fileStream)
  .on('finish', () => console.log('File downloaded successfully'))
  .on('error', err => console.error(err));
```

#### v2 Example

```javascript
const fs = require('fs');
const { GetObjectCommand } = require('ibm-cos-sdk-v2');

const command = new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'large-file.bin'
});

try {
  const response = await client.send(command);
  const fileStream = fs.createWriteStream('downloaded-file.bin');
  
  response.Body.pipe(fileStream);
  
  await new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
  
  console.log('File downloaded successfully');
} catch (err) {
  console.error('Error downloading file:', err);
}
```

---

## Multipart Upload

### Manual Multipart Upload

#### v1 Example

```javascript
const fs = require('fs');

const params = {
  Bucket: 'my-bucket',
  Key: 'large-file.bin'
};

// Initiate multipart upload
cos.createMultipartUpload(params, (err, multipart) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const uploadId = multipart.UploadId;
  const partSize = 5 * 1024 * 1024; // 5MB
  const fileStream = fs.createReadStream('large-file.bin');
  
  // Upload parts...
  // Complete multipart upload...
});
```

#### v2 Example

```javascript
const fs = require('fs');
const { 
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} = require('ibm-cos-sdk-v2');

try {
  // Initiate multipart upload
  const createCommand = new CreateMultipartUploadCommand({
    Bucket: 'my-bucket',
    Key: 'large-file.bin'
  });
  
  const { UploadId } = await client.send(createCommand);
  
  const partSize = 5 * 1024 * 1024; // 5MB
  const fileStream = fs.createReadStream('large-file.bin');
  
  // Upload parts...
  const uploadPartCommand = new UploadPartCommand({
    Bucket: 'my-bucket',
    Key: 'large-file.bin',
    UploadId: UploadId,
    PartNumber: 1,
    Body: partData
  });
  
  const partResult = await client.send(uploadPartCommand);
  
  // Complete multipart upload
  const completeCommand = new CompleteMultipartUploadCommand({
    Bucket: 'my-bucket',
    Key: 'large-file.bin',
    UploadId: UploadId,
    MultipartUpload: {
      Parts: [
        {
          ETag: partResult.ETag,
          PartNumber: 1
        }
      ]
    }
  });
  
  await client.send(completeCommand);
  console.log('Multipart upload completed');
} catch (err) {
  console.error('Error in multipart upload:', err);
}
```

### Using Upload Manager

#### v2 Upload Manager

The v2 SDK provides a high-level `Upload` class that handles multipart uploads automatically:

```javascript
const { Upload } = require('@ibm-cos/lib-storage');
const { S3Client } = require('ibm-cos-sdk-v2');
const fs = require('fs');

const client = new S3Client(config);

const fileStream = fs.createReadStream('large-file.bin');

const upload = new Upload({
  client: client,
  params: {
    Bucket: 'my-bucket',
    Key: 'large-file.bin',
    Body: fileStream
  },
  queueSize: 4, // Concurrent parts
  partSize: 5 * 1024 * 1024, // 5MB parts
  leavePartsOnError: false
});

// Track progress
upload.on('httpUploadProgress', (progress) => {
  console.log('Upload progress:', progress);
});

try {
  const result = await upload.done();
  console.log('Upload completed:', result);
} catch (err) {
  console.error('Upload failed:', err);
}
```

---

## Pagination

### List Objects V2

#### v1 Pagination

```javascript
function listAllObjects(bucket, prefix) {
  const allObjects = [];
  
  function listPage(continuationToken) {
    const params = {
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken
    };
    
    cos.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      
      allObjects.push(...data.Contents);
      
      if (data.IsTruncated) {
        listPage(data.NextContinuationToken);
      } else {
        console.log('Total objects:', allObjects.length);
      }
    });
  }
  
  listPage();
}
```

#### v2 Pagination with Paginators

```javascript
const { paginateListObjectsV2 } = require('ibm-cos-sdk-v2');

async function listAllObjects(bucket, prefix) {
  const allObjects = [];
  
  const paginatorConfig = {
    client: client,
    pageSize: 1000
  };
  
  const commandParams = {
    Bucket: bucket,
    Prefix: prefix
  };
  
  const paginator = paginateListObjectsV2(paginatorConfig, commandParams);
  
  try {
    for await (const page of paginator) {
      if (page.Contents) {
        allObjects.push(...page.Contents);
      }
    }
    
    console.log('Total objects:', allObjects.length);
    return allObjects;
  } catch (err) {
    console.error('Error listing objects:', err);
    throw err;
  }
}
```

**Alternative Manual Pagination:**

```javascript
const { ListObjectsV2Command } = require('ibm-cos-sdk-v2');

async function listAllObjects(bucket, prefix) {
  const allObjects = [];
  let continuationToken = undefined;
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken
    });
    
    const response = await client.send(command);
    
    if (response.Contents) {
      allObjects.push(...response.Contents);
    }
    
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  
  console.log('Total objects:', allObjects.length);
  return allObjects;
}
```

---

## Presigned URLs

### Generate Presigned GET URL

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  Expires: 3600 // 1 hour
};

cos.getSignedUrl('getObject', params, (err, url) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Presigned URL:', url);
  }
});
```

#### v2 Example

```javascript
const { GetObjectCommand } = require('ibm-cos-sdk-v2');
const { getSignedUrl } = require('@ibm-cos/s3-request-presigner');

const command = new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt'
});

try {
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log('Presigned URL:', url);
} catch (err) {
  console.error('Error generating presigned URL:', err);
}
```

### Generate Presigned PUT URL

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'upload-object.txt',
  Expires: 3600,
  ContentType: 'text/plain'
};

cos.getSignedUrl('putObject', params, (err, url) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Presigned PUT URL:', url);
  }
});
```

#### v2 Example

```javascript
const { PutObjectCommand } = require('ibm-cos-sdk-v2');
const { getSignedUrl } = require('@ibm-cos/s3-request-presigner');

const command = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'upload-object.txt',
  ContentType: 'text/plain'
});

try {
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log('Presigned PUT URL:', url);
} catch (err) {
  console.error('Error generating presigned URL:', err);
}
```

---

## Error Handling

### Error Structure Changes

#### v1 Error Handling

```javascript
cos.getObject(params, (err, data) => {
  if (err) {
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Status code:', err.statusCode);
    console.error('Request ID:', err.requestId);
  } else {
    console.log('Success:', data);
  }
});
```

#### v2 Error Handling

```javascript
const { GetObjectCommand } = require('ibm-cos-sdk-v2');

try {
  const command = new GetObjectCommand(params);
  const response = await client.send(command);
  console.log('Success:', response);
} catch (err) {
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Status code:', err.$metadata?.httpStatusCode);
  console.error('Request ID:', err.$metadata?.requestId);
  
  // Check for specific error types
  if (err.name === 'NoSuchKey') {
    console.error('Object does not exist');
  } else if (err.name === 'AccessDenied') {
    console.error('Access denied to object');
  }
}
```

### Common Error Types

| Error Name          | Description               | v1 Code               | v2 Name               |
|---------------------|---------------------------|-----------------------|-----------------------|
| NoSuchBucket        | Bucket does not exist     | `NoSuchBucket`        | `NoSuchBucket`        |
| NoSuchKey           | Object does not exist     | `NoSuchKey`           | `NoSuchKey`           |
| AccessDenied        | Insufficient permissions  | `AccessDenied`        | `AccessDenied`        |
| InvalidBucketName   | Invalid bucket name       | `InvalidBucketName`   | `InvalidBucketName`   |
| BucketAlreadyExists | Bucket name already taken | `BucketAlreadyExists` | `BucketAlreadyExists` |
| InvalidAccessKeyId  | Invalid credentials       | `InvalidAccessKeyId`  | `InvalidAccessKeyId`  |

---

## Access Control Lists (ACL)

### Bucket ACL

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  ACL: 'public-read'
};

cos.putBucketAcl(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Bucket ACL updated');
});
```

#### v2 Example

```javascript
const { PutBucketAclCommand } = require('ibm-cos-sdk-v2');

const command = new PutBucketAclCommand({
  Bucket: 'my-bucket',
  ACL: 'public-read'
});

try {
  await client.send(command);
  console.log('Bucket ACL updated');
} catch (err) {
  console.error('Error updating bucket ACL:', err);
}
```

### Object ACL

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  ACL: 'public-read'
};

cos.putObjectAcl(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Object ACL updated');
});
```

#### v2 Example

```javascript
const { PutObjectAclCommand } = require('ibm-cos-sdk-v2');

const command = new PutObjectAclCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  ACL: 'public-read'
});

try {
  await client.send(command);
  console.log('Object ACL updated');
} catch (err) {
  console.error('Error updating object ACL:', err);
}
```

### Canned ACL

Both v1 and v2 support the same canned ACL values:

- `private` - Owner gets full control
- `public-read` - Owner gets full control, everyone else gets read access
- `public-read-write` - Owner gets full control, everyone else gets read and write access
- `authenticated-read` - Owner gets full control, authenticated users get read access

---

## Metadata and Tagging

### Object Metadata

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  Body: 'content',
  Metadata: {
    'author': 'John Doe',
    'department': 'Engineering'
  }
};

cos.putObject(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Object uploaded with metadata');
});
```

#### v2 Example

```javascript
const { PutObjectCommand } = require('ibm-cos-sdk-v2');

const command = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  Body: 'content',
  Metadata: {
    'author': 'John Doe',
    'department': 'Engineering'
  }
});

try {
  await client.send(command);
  console.log('Object uploaded with metadata');
} catch (err) {
  console.error('Error uploading object:', err);
}
```

### Bucket Tagging

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Tagging: {
    TagSet: [
      { Key: 'Environment', Value: 'Production' },
      { Key: 'Project', Value: 'WebApp' }
    ]
  }
};

cos.putBucketTagging(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Bucket tags updated');
});
```

#### v2 Example

```javascript
const { PutBucketTaggingCommand } = require('ibm-cos-sdk-v2');

const command = new PutBucketTaggingCommand({
  Bucket: 'my-bucket',
  Tagging: {
    TagSet: [
      { Key: 'Environment', Value: 'Production' },
      { Key: 'Project', Value: 'WebApp' }
    ]
  }
});

try {
  await client.send(command);
  console.log('Bucket tags updated');
} catch (err) {
  console.error('Error updating bucket tags:', err);
}
```

### Object Tagging

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  Tagging: {
    TagSet: [
      { Key: 'Status', Value: 'Reviewed' },
      { Key: 'Priority', Value: 'High' }
    ]
  }
};

cos.putObjectTagging(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Object tags updated');
});
```

#### v2 Example

```javascript
const { PutObjectTaggingCommand } = require('ibm-cos-sdk-v2');

const command = new PutObjectTaggingCommand({
  Bucket: 'my-bucket',
  Key: 'my-object.txt',
  Tagging: {
    TagSet: [
      { Key: 'Status', Value: 'Reviewed' },
      { Key: 'Priority', Value: 'High' }
    ]
  }
});

try {
  await client.send(command);
  console.log('Object tags updated');
} catch (err) {
Rules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        AllowedOrigins: ['https://example.com'],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000
      }
    ]
  }
};

cos.putBucketCors(params, (err, data) => {
  if (err) console.error(err);
  else console.log('CORS configuration set');
});
```

### Put CORS Configuration

#### v2 Example

```javascript
const { PutBucketCorsCommand } = require('ibm-cos-sdk-v2');

const command = new PutBucketCorsCommand({
  Bucket: 'my-bucket',
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        AllowedOrigins: ['https://example.com'],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000
      }
    ]
  }
});

try {
  await client.send(command);
  console.log('CORS configuration set');
} catch (err) {
  console.error('Error setting CORS:', err);
}
```

### Get CORS Configuration

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket'
};

cos.getBucketCors(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('CORS rules:', data.CORSRules);
  }
});
```

#### v2 Example

```javascript
const { GetBucketCorsCommand } = require('ibm-cos-sdk-v2');

const command = new GetBucketCorsCommand({
  Bucket: 'my-bucket'
});

try {
  const response = await client.send(command);
  console.log('CORS rules:', response.CORSRules);
} catch (err) {
  console.error('Error getting CORS:', err);
}
```

---

## Lifecycle Configuration

### Set Lifecycle Configuration

#### v1 Example

```javascript
const params = {
  Bucket: 'my-bucket',
  LifecycleConfiguration: {
    Rules: [
      {
        Id: 'DeleteOldFiles',
        Status: 'Enabled',
        Prefix: 'logs/',
        Expiration: {
          Days: 30
        }
      }
    ]
  }
};

cos.putBucketLifecycleConfiguration(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Lifecycle configuration set');
});
```

#### v2 Example

```javascript
const { PutBucketLifecycleConfigurationCommand } = require('ibm-cos-sdk-v2');

const command = new PutBucketLifecycleConfigurationCommand({
  Bucket: 'my-bucket',
  LifecycleConfiguration: {
    Rules: [
      {
        Id: 'DeleteOldFiles',
        Status: 'Enabled',
        Filter: {
          Prefix: 'logs/'
        },
        Expiration: {
          Days: 30
        }
      }
    ]
  }
});

try {
  await client.send(command);
  console.log('Lifecycle configuration set');
} catch (err) {
  console.error('Error setting lifecycle:', err);
}
```

---

## IBM-Specific Features

### Bucket Protection (WORM)

IBM Cloud Object Storage supports Write-Once-Read-Many (WORM) bucket protection for compliance and data retention.

#### Set Bucket Protection

**v1 Example:**

```javascript
const params = {
  Bucket: 'my-protected-bucket',
  ProtectionConfiguration: {
    Status: 'Retention',
    MinimumRetention: {
      Days: 30
    },
    MaximumRetention: {
      Days: 365
    },
    DefaultRetention: {
      Days: 90
    }
  }
};

cos.putBucketProtectionConfiguration(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Bucket protection configured');
});
```

**v2 Example:**

```javascript
const { PutBucketProtectionConfigurationCommand } = require('ibm-cos-sdk-v2');

const command = new PutBucketProtectionConfigurationCommand({
  Bucket: 'my-protected-bucket',
  ProtectionConfiguration: {
    Status: 'Retention',
    MinimumRetention: {
      Days: 30
    },
    MaximumRetention: {
      Days: 365
    },
    DefaultRetention: {
      Days: 90
    }
  }
});

try {
  await client.send(command);
  console.log('Bucket protection configured');
} catch (err) {
  console.error('Error configuring protection:', err);
}
```

#### Get Bucket Protection

**v2 Example:**

```javascript
const { GetBucketProtectionConfigurationCommand } = require('ibm-cos-sdk-v2');

const command = new GetBucketProtectionConfigurationCommand({
  Bucket: 'my-protected-bucket'
});

try {
  const response = await client.send(command);
  console.log('Protection status:', response.Status);
  console.log('Default retention:', response.DefaultRetention);
} catch (err) {
  console.error('Error getting protection config:', err);
}
```

### Legal Hold

Legal holds prevent object deletion regardless of retention period.

#### Add Legal Hold

**v2 Example:**

```javascript
const { AddLegalHoldCommand } = require('ibm-cos-sdk-v2');

const command = new AddLegalHoldCommand({
  Bucket: 'my-bucket',
  Key: 'important-document.pdf',
  RetentionLegalHoldId: 'legal-case-12345'
});

try {
  await client.send(command);
  console.log('Legal hold added');
} catch (err) {
  console.error('Error adding legal hold:', err);
}
```

#### List Legal Holds

**v2 Example:**

```javascript
const { ListLegalHoldsCommand } = require('ibm-cos-sdk-v2');

const command = new ListLegalHoldsCommand({
  Bucket: 'my-bucket'
});

try {
  const response = await client.send(command);
  console.log('Legal holds:', response.LegalHolds);
} catch (err) {
  console.error('Error listing legal holds:', err);
}
```

#### Delete Legal Hold

**v2 Example:**

```javascript
const { DeleteLegalHoldCommand } = require('ibm-cos-sdk-v2');

const command = new DeleteLegalHoldCommand({
  Bucket: 'my-bucket',
  Key: 'important-document.pdf',
  RetentionLegalHoldId: 'legal-case-12345'
});

try {
  await client.send(command);
  console.log('Legal hold removed');
} catch (err) {
  console.error('Error removing legal hold:', err);
}
```

### Key Protect Integration

IBM Key Protect provides encryption key management for bucket-level encryption.

#### v1 Example

```javascript
const params = {
  Bucket: 'my-encrypted-bucket',
  CreateBucketConfiguration: {
    LocationConstraint: 'us-south-standard'
  },
  IBMSSEKPEncryptionAlgorithm: 'AES256',
  IBMSSEKPCustomerRootKeyCrn: 'crn:v1:bluemix:public:kms:us-south:...'
};

cos.createBucket(params, (err, data) => {
  if (err) console.error(err);
  else console.log('Encrypted bucket created');
});
```

#### v2 Example

```javascript
const { CreateBucketCommand } = require('ibm-cos-sdk-v2');

const command = new CreateBucketCommand({
  Bucket: 'my-encrypted-bucket',
  CreateBucketConfiguration: {
    LocationConstraint: 'us-south-standard'
  },
  IBMSSEKPEncryptionAlgorithm: 'AES256',
  IBMSSEKPCustomerRootKeyCrn: 'crn:v1:bluemix:public:kms:us-south:...'
});

try {
  await client.send(command);
  console.log('Encrypted bucket created');
} catch (err) {
  console.error('Error creating encrypted bucket:', err);
}
```

---

## Waiters

Waiters allow you to wait for a resource to reach a specific state before proceeding.

### Wait for Bucket to Exist

#### v2 Waiter Example

```javascript
const { waitUntilBucketExists } = require('ibm-cos-sdk-v2');

try {
  await waitUntilBucketExists(
    {
      client: client,
      maxWaitTime: 120, // Maximum wait time in seconds
      minDelay: 2, // Minimum delay between checks in seconds
      maxDelay: 10 // Maximum delay between checks in seconds
    },
    {
      Bucket: 'my-bucket'
    }
  );
  console.log('Bucket exists and is ready');
} catch (err) {
  console.error('Bucket did not become available:', err);
}
```

### Wait for Object to Exist

#### v2 Waiter Example

```javascript
const { waitUntilObjectExists } = require('ibm-cos-sdk-v2');

try {
  await waitUntilObjectExists(
    {
      client: client,
      maxWaitTime: 60,
      minDelay: 1,
      maxDelay: 5
    },
    {
      Bucket: 'my-bucket',
      Key: 'my-object.txt'
    }
  );
  console.log('Object exists and is ready');
} catch (err) {
  console.error('Object did not become available:', err);
}
```

---

## Best Practices

### Reuse Service Clients

Create a single client instance and reuse it across your application to improve performance and reduce memory usage.

**Good Practice:**

```javascript
const { S3Client } = require('ibm-cos-sdk-v2');

// Create once
const client = new S3Client(config);

// Reuse for multiple operations
async function uploadFile(bucket, key, body) {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body });
  return await client.send(command);
}

async function downloadFile(bucket, key) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await client.send(command);
}
```

**Avoid:**

```javascript
// Don't create a new client for each operation
async function uploadFile(bucket, key, body) {
  const client = new S3Client(config); // Inefficient
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body });
  return await client.send(command);
}
```

### Handle Streams Properly

Always handle stream errors and ensure streams are properly closed.

```javascript
const { GetObjectCommand } = require('ibm-cos-sdk-v2');
const fs = require('fs');

async function downloadToFile(bucket, key, filePath) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  
  try {
    const response = await client.send(command);
    const writeStream = fs.createWriteStream(filePath);
    
    return new Promise((resolve, reject) => {
      response.Body.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      response.Body.on('error', reject);
    });
  } catch (err) {
    console.error('Download failed:', err);
    throw err;
  }
}
```

### Configure Timeouts

Set appropriate timeouts to prevent hanging requests.

```javascript
const { S3Client } = require('ibm-cos-sdk-v2');
const { NodeHttpHandler } = require('@ibm-cos/node-http-handler');

const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 5000, // 5 seconds
    socketTimeout: 30000 // 30 seconds
  })
});
```

### Use Appropriate Part Sizes

For multipart uploads, choose part sizes based on your file size and network conditions.

```javascript
const { Upload } = require('@ibm-cos/lib-storage');

// For files < 100MB
const smallFileUpload = new Upload({
  client: client,
  params: { Bucket: 'my-bucket', Key: 'small-file', Body: stream },
  partSize: 5 * 1024 * 1024, // 5MB
  queueSize: 4
});

// For files > 1GB
const largeFileUpload = new Upload({
  client: client,
  params: { Bucket: 'my-bucket', Key: 'large-file', Body: stream },
  partSize: 25 * 1024 * 1024, // 25MB
  queueSize: 8
});
```

---

## Troubleshooting

### Common Migration Issues

#### Issue: Module Not Found

**Problem:**

```bash
Error: Cannot find module 'ibm-cos-sdk-v2'
```

**Solution:**

Ensure you've installed the v2 SDK:

```bash
npm install ibm-cos-sdk-v2
```

Verify your imports:

```javascript
// Correct
const { S3Client, PutObjectCommand } = require('ibm-cos-sdk-v2');

// Incorrect
const { S3Client } = require('ibm-cos-sdk'); // v1 package
```

#### Issue: Authentication Failures

**Problem:**

```bash
Error: The request signature we calculated does not match the signature you provided
```

**Solution:**

1. Verify your credentials are correct
2. Ensure you're using the correct endpoint for your region
3. Check that your API key has the necessary permissions

```javascript
const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  credentials: {
    accessKeyId: 'YOUR_API_KEY',
    secretAccessKey: 'YOUR_SERVICE_INSTANCE_ID'
  }
});
```

#### Issue: Stream Handling Errors

**Problem:**

```bash
Error: Cannot read property 'pipe' of undefined
```

**Solution:**

In v2, response bodies are streams that need to be handled differently:

```javascript
// v2 - Correct way to handle response body
const response = await client.send(new GetObjectCommand(params));

// Convert to string
const bodyContents = await response.Body.transformToString();

// Or pipe to file
const writeStream = fs.createWriteStream('output.txt');
response.Body.pipe(writeStream);
```

#### Issue: Timeout Errors

**Problem:**

```bash
Error: Connection timeout
```

**Solution:**

Configure appropriate timeouts:

```javascript
const { NodeHttpHandler } = require('@ibm-cos/node-http-handler');

const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 10000,
    socketTimeout: 60000
  })
});
```

### Debugging Tips

**Enable SDK Logging:**

```javascript
const { S3Client } = require('ibm-cos-sdk-v2');

const client = new S3Client({
  region: 'us-south',
  endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
  logger: console
});
```

**Inspect Request Metadata:**

```javascript
try {
  const response = await client.send(command);
  console.log('Request ID:', response.$metadata.requestId);
  console.log('HTTP Status:', response.$metadata.httpStatusCode);
} catch (err) {
  console.log('Error metadata:', err.$metadata);
}
```

**Use Try-Catch Blocks:**

```javascript
async function safeOperation() {
  try {
    const response = await client.send(command);
    return response;
  } catch (err) {
    console.error('Operation failed:', {
      name: err.name,
      message: err.message,
      statusCode: err.$metadata?.httpStatusCode,
      requestId: err.$metadata?.requestId
    });
    throw err;
  }
}
```

---

## Comparison Table

| Feature               | v1 (ibm-cos-sdk)                     | v2 (ibm-cos-sdk-v2)                         | Notes                                           |
|-----------------------|--------------------------------------|---------------------------------------------|-------------------------------------------------|
| **Package Structure** | Monolithic                           | Modular                                     | v2 allows importing only needed components      |
| **Import Pattern**    | `require('ibm-cos-sdk')`             | `require('ibm-cos-sdk-v2')`                 | v2 uses named imports                           |
| **Client Creation**   | `new IBM.S3(config)`                 | `new S3Client(config)`                      | v2 uses dedicated client class                  |
| **API Calls**         | `client.operation(params, callback)` | `client.send(new OperationCommand(params))` | v2 uses command pattern                         |
| **Async Support**     | Callbacks + `.promise()`             | Native async/await                          | v2 is promise-first                             |
| **Error Handling**    | `err.code`, `err.statusCode`         | `err.name`, `err.$metadata`                 | v2 has structured error metadata                |
| **Streaming**         | Direct stream support                | Stream via `Body` property                  | v2 requires `.transformToString()` or `.pipe()` |
| **Multipart Upload**  | Manual implementation                | `@ibm-cos/lib-storage`                      | v2 has dedicated Upload class                   |
| **Presigned URLs**    | `getSignedUrl()` method              | `@ibm-cos/s3-request-presigner`             | v2 uses separate package                        |
| **Pagination**        | Callback-based                       | Async iterators                             | v2 has `paginate*` functions                    |
| **Waiters**           | Not available                        | Built-in waiters                            | v2 has `waitUntil*` functions                   |
| **TypeScript**        | Community types                      | Native TypeScript                           | v2 has built-in type definitions                |
| **Node.js Version**   | Node.js 10+                          | Node.js 14+                                 | v2 requires newer Node.js                       |
| **Middleware**        | Limited                              | Extensible middleware stack                 | v2 allows custom middleware                     |
| **HTTP Client**       | Built-in                             | Configurable (`NodeHttpHandler`)            | v2 allows custom HTTP handlers                  |

---

## Conclusion

Migrating from IBM COS SDK for JavaScript v1 to v2 requires updating your code to use the new modular architecture and command pattern. While this involves some refactoring, the benefits include:

- **Smaller bundle sizes** through tree-shaking
- **Better performance** with optimized HTTP handling
- **Improved developer experience** with TypeScript and modern JavaScript
- **Future compatibility** with AWS SDK v3 ecosystem

Follow this guide step-by-step, test thoroughly, and leverage the new features to build more efficient and maintainable applications.

For additional help:

- [IBM Cloud Object Storage Documentation](https://cloud.ibm.com/docs/cloud-object-storage)
- [SDK GitHub Repository](https://github.ibm.com/cos-clevos/ibm-cos-sdk-js-v2)
- [IBM Cloud Support](https://cloud.ibm.com/unifiedsupport/supportcenter)
- [IBM Cloud Support](https://cloud.ibm.com/unifiedsupport/supportcenter)
