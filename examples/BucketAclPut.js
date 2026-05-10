'use strict';

/**
 * IBM Cloud Object Storage - Put Bucket ACL Example
 * 
 * This example demonstrates how to set the Access Control List (ACL)
 * for a bucket using predefined ACLs.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketAclPut.js
 */

const { S3Client, PutBucketAclCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const REGION = process.env.REGION || 'us-south';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket';

// ACL options: 'private' | 'public-read' | 'public-read-write'
const ACL = 'private';

// ============================================================================
// PUT BUCKET ACL
// ============================================================================

async function putBucketAcl() {
  try {
    // Initialize client
    const client = new S3Client({
      endpoint: ENDPOINT,
      region: REGION,
      credentials: {
        apiKey: API_KEY,
        serviceInstanceId: SERVICE_INSTANCE_ID,
      },
    });

    console.log('Setting bucket ACL...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('ACL: ' + ACL);
    console.log('');
    
    const command = new PutBucketAclCommand({
      Bucket: BUCKET_NAME,
      ACL: ACL,
    });

    await client.send(command);
    
    console.log('Bucket ACL set successfully!');
    console.log('');
    console.log('ACL Options:');
    console.log('- private: Owner gets FULL_CONTROL, no one else has access');
    console.log('- public-read: Owner gets FULL_CONTROL, everyone gets READ access');
    console.log('- public-read-write: Owner gets FULL_CONTROL, everyone gets READ and WRITE');
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

putBucketAcl();
