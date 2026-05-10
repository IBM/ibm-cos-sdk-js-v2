'use strict';

/**
 * IBM Cloud Object Storage - List Buckets Example
 * 
 * This example demonstrates how to list all buckets in your account.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketList.js
 */

const { S3Client, ListBucketsCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const REGION = process.env.REGION || 'us-south';

// ============================================================================
// LIST BUCKETS
// ============================================================================

async function listBuckets() {
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

    // List buckets
    console.log('Listing buckets...');
    
    const command = new ListBucketsCommand({});
    const response = await client.send(command);
    
    console.log('Buckets found: ' + response.Buckets.length);
    console.log('');
    
    response.Buckets.forEach((bucket, index) => {
      console.log((index + 1) + '. ' + bucket.Name);
      console.log('   Created: ' + bucket.CreationDate);
    });
    
  } catch (error) {
    console.error('Error: ' + error.message);
    process.exit(1);
  }
}

listBuckets();
