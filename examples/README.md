# IBM Cloud Object Storage SDK v2 - JavaScript Examples

Simple, ready-to-run examples for IBM Cloud Object Storage using the JavaScript SDK v2.

## Quick Start

### Option 1: Using Environment Variables (Recommended for Testing)

1. Install dependencies:
```bash
npm install
```

2. Create your local configuration:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials:
```bash
API_KEY=your_actual_api_key
SERVICE_INSTANCE_ID=your_service_crn
ENDPOINT=https://s3.us-south.cloud-object-storage.appdomain.cloud
BUCKET_NAME=my-test-bucket
```

4. Run any example:
```bash
node BucketCreate.js
```

**Benefits:**
- ✅ Test locally without modifying example files
- ✅ Safe for GitHub (`.env` is gitignored)
- ✅ No need to replace placeholders before committing

### Option 2: Direct Replacement (Simple but Manual)

1. Open any example file
2. Replace placeholder values at the top:
```javascript
const API_KEY = 'YOUR_API_KEY_HERE';  // Replace this
const SERVICE_INSTANCE_ID = 'YOUR_SERVICE_INSTANCE_CRN_HERE';  // Replace this
```

3. Run the example:
```bash
node BucketCreate.js
```

**Note:** Remember to restore placeholders before committing to GitHub!

## Available Examples (30 total)

### Bucket Operations (11 examples)
- **BucketCreate.js** - Create a new bucket
- **BucketCreateWithObjectLock.js** - Create bucket with Object Lock enabled
- **BucketDelete.js** - Delete a bucket
- **BucketList.js** - List all buckets
- **BucketAclGet.js** - Get bucket ACL permissions
- **BucketAclPut.js** - Set bucket ACL permissions
- **BucketLifecyclePut.js** - Set lifecycle configuration
- **BucketLifecycleGet.js** - Get lifecycle configuration
- **BucketLifecycleDelete.js** - Delete lifecycle configuration
- **BucketReplicationPut.js** - Configure bucket replication
- **BucketWebsite.js** - Configure bucket as static website

### Object Operations (19 examples)
- **ObjectPut.js** - Upload an object
- **ObjectGet.js** - Download an object
- **ObjectDelete.js** - Delete an object
- **ObjectCopy.js** - Copy object between buckets
- **ObjectHead.js** - Get object metadata
- **ObjectMetadata.js** - Upload with custom metadata
- **ObjectList.js** - List objects in bucket
- **ObjectListing.js** - List objects with pagination
- **ObjectMultipart.js** - Multipart upload for large files
- **ObjectMultipartList.js** - List in-progress multipart uploads
- **ObjectAclGet.js** - Get object ACL permissions
- **ObjectTaggingPut.js** - Add tags to object
- **ObjectTaggingGet.js** - Get object tags
- **ObjectTaggingDelete.js** - Delete object tags
- **ObjectVersioningPut.js** - Enable versioning and upload
- **ObjectVersioningGet.js** - List object versions
- **ObjectVersioningDelete.js** - Delete specific version
- **ObjectLockPut.js** - Set object retention lock
- **ObjectLockGet.js** - Get object retention lock

Quick test workflow:
```bash
# Setup
cp .env.example .env
# Edit .env with your credentials
npm install

# Test basic operations
node BucketCreate.js
node ObjectPut.js
node ObjectList.js
node ObjectGet.js
node ObjectDelete.js
node BucketDelete.js
```

## Getting Your Credentials

1. **API Key**: Create a service credential in your IBM Cloud Object Storage instance
2. **Service Instance ID**: Found in your service credentials (CRN)
3. **Endpoint**: Choose from available endpoints based on your bucket location

### Common Endpoints
- US South: `https://s3.us-south.cloud-object-storage.appdomain.cloud`
- US East: `https://s3.us-east.cloud-object-storage.appdomain.cloud`
- EU Great Britain: `https://s3.eu-gb.cloud-object-storage.appdomain.cloud`

## Prerequisites

- Node.js 14 or higher
- IBM Cloud account with Object Storage service
- Valid IAM API key with appropriate permissions

## Example Workflows

### Basic Workflow
```bash
node BucketCreate.js      # Create bucket
node ObjectPut.js         # Upload file
node ObjectList.js        # List objects
node ObjectGet.js         # Download file
node ObjectDelete.js      # Delete object
node BucketDelete.js      # Delete bucket
```

### Object Versioning
```bash
node ObjectVersioningPut.js    # Enable versioning
node ObjectVersioningPut.js    # Upload again (new version)
node ObjectVersioningGet.js    # List versions
node ObjectVersioningDelete.js # Delete specific version
```

### Object Lock (WORM)
```bash
node BucketCreateWithObjectLock.js  # Create locked bucket
node ObjectPut.js                   # Upload object
node ObjectLockPut.js               # Set retention
node ObjectLockGet.js               # View retention
```

### Lifecycle Management
```bash
node BucketLifecyclePut.js     # Set lifecycle rules
node BucketLifecycleGet.js     # View configuration
node BucketLifecycleDelete.js  # Remove rules
```

## Notes

- Bucket names must be globally unique across all IBM Cloud Object Storage
- Objects must be deleted before deleting a bucket
- For large files (over 100MB), use ObjectMultipart.js
- Object Lock requires bucket to be created with lock enabled
- Versioning must be enabled for replication
- `.env` file is gitignored for security

## Support

For issues or questions, refer to the [IBM Cloud Object Storage documentation](https://cloud.ibm.com/docs/cloud-object-storage).