'use strict';

/**
 * IBM Cloud Object Storage - Delete Object Example
 * 
 * This example demonstrates how to delete an object from a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectDelete.js
 */

const { S3Client, DeleteObjectCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const REGION = process.env.REGION || 'us-south';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket';
const OBJECT_KEY = process.env.OBJECT_KEY || 'my-file.txt';

// ============================================================================
// DELETE OBJECT
// ============================================================================

async function deleteObject() {
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

    // Delete object
    console.log('Deleting object...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
    });

    await client.send(command);
    
    console.log('Object deleted successfully');
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    }
    process.exit(1);
  }
}

deleteObject();
