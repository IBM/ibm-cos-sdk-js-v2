'use strict';

/**
 * IBM Cloud Object Storage - Create Bucket Example
 * 
 * This example demonstrates how to create a new bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketCreate.js
 */

const { S3Client, CreateBucketCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-new-bucket-' + Date.now();
const BUCKET_LOCATION = process.env.BUCKET_LOCATION || 'us-south';
const REGION = process.env.REGION || 'us-south';

// ============================================================================
// CREATE BUCKET
// ============================================================================

async function createBucket() {
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

    // Create bucket
    console.log('Creating bucket: ' + BUCKET_NAME);
    
    const command = new CreateBucketCommand({
      Bucket: BUCKET_NAME,
      CreateBucketConfiguration: {
        LocationConstraint: BUCKET_LOCATION,
      },
    });

    await client.send(command);
    
    console.log('Bucket created successfully');
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'BucketAlreadyExists') {
      console.error('Bucket name already taken. Try a different name.');
    } else if (error.name === 'BucketAlreadyOwnedByYou') {
      console.error('You already own a bucket with this name.');
    }
    process.exit(1);
  }
}

createBucket();
