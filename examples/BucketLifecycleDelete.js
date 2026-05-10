'use strict';

/**
 * IBM Cloud Object Storage - Delete Bucket Lifecycle Configuration Example
 * 
 * This example demonstrates how to remove all lifecycle rules from a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketLifecycleDelete.js
 */

const { S3Client, DeleteBucketLifecycleCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket';
const REGION = process.env.REGION || 'us-south';

// ============================================================================
// DELETE BUCKET LIFECYCLE CONFIGURATION
// ============================================================================

async function deleteBucketLifecycle() {
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

    console.log('Deleting bucket lifecycle configuration...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('');
    
    const command = new DeleteBucketLifecycleCommand({
      Bucket: BUCKET_NAME,
    });

    await client.send(command);
    
    console.log('Bucket lifecycle configuration deleted successfully!');
    console.log('');
    console.log('Note: All lifecycle rules have been removed from the bucket.');
    console.log('Objects will no longer be automatically expired or transitioned.');
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'NoSuchLifecycleConfiguration') {
      console.error('No lifecycle configuration found for this bucket.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

deleteBucketLifecycle();
