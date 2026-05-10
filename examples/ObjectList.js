'use strict';

/**
 * IBM Cloud Object Storage - List Objects Example
 * 
 * This example demonstrates how to list objects in a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectList.js
 */

const { S3Client, ListObjectsV2Command } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const REGION = process.env.REGION || 'us-south';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket';

// ============================================================================
// LIST OBJECTS
// ============================================================================

async function listObjects() {
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

    // List objects
    console.log('Listing objects in bucket: ' + BUCKET_NAME);
    
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const response = await client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log('No objects found in bucket');
      return;
    }
    
    console.log('Objects found: ' + response.Contents.length);
    console.log('');
    
    response.Contents.forEach((object, index) => {
      console.log((index + 1) + '. ' + object.Key);
      console.log('   Size: ' + object.Size + ' bytes');
      console.log('   Last Modified: ' + object.LastModified);
    });
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    }
    process.exit(1);
  }
}

listObjects();
