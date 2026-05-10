'use strict';

/**
 * IBM Cloud Object Storage - Copy Object Example
 * 
 * This example demonstrates how to copy an object between buckets.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectCopy.js
 */

const { S3Client, CopyObjectCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const REGION = process.env.REGION || 'us-south';
const SOURCE_BUCKET = 'my-source-bucket';
const SOURCE_KEY = 'source-file.txt';
const DESTINATION_BUCKET = 'my-destination-bucket';
const DESTINATION_KEY = 'copied-file.txt';

// ============================================================================
// COPY OBJECT
// ============================================================================

async function copyObject() {
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

    // Copy object
    console.log('Copying object...');
    console.log('From: ' + SOURCE_BUCKET + '/' + SOURCE_KEY);
    console.log('To: ' + DESTINATION_BUCKET + '/' + DESTINATION_KEY);
    
    const command = new CopyObjectCommand({
      Bucket: DESTINATION_BUCKET,
      Key: DESTINATION_KEY,
      CopySource: SOURCE_BUCKET + '/' + SOURCE_KEY,
    });

    const response = await client.send(command);
    
    console.log('Object copied successfully');
    if (response.CopyObjectResult) {
      console.log('ETag: ' + response.CopyObjectResult.ETag);
      console.log('Last Modified: ' + response.CopyObjectResult.LastModified);
    }
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchKey') {
      console.error('Source object does not exist.');
    } else if (error.name === 'NoSuchBucket') {
      console.error('Source or destination bucket does not exist.');
    }
    process.exit(1);
  }
}

copyObject();
