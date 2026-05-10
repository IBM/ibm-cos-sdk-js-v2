'use strict';

/**
 * IBM Cloud Object Storage - Delete Bucket Example
 * 
 * This example demonstrates how to delete a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketDelete.js
 */

const { S3Client, DeleteBucketCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket-to-delete';
const REGION = process.env.REGION || 'us-south';

// ============================================================================
// DELETE BUCKET
// ============================================================================

async function deleteBucket() {
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

    // Delete bucket
    console.log('Deleting bucket: ' + BUCKET_NAME);
    
    const command = new DeleteBucketCommand({
      Bucket: BUCKET_NAME,
    });

    await client.send(command);
    
    console.log('Bucket deleted successfully');
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'BucketNotEmpty') {
      console.error('Bucket is not empty. Delete all objects first.');
    }
    process.exit(1);
  }
}

deleteBucket();
