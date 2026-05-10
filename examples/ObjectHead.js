'use strict';

/**
 * IBM Cloud Object Storage - Get Object Metadata Example
 * 
 * This example demonstrates how to retrieve object metadata without downloading the object.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectHead.js
 */

const { S3Client, HeadObjectCommand } = require('ibm-cos-sdk-v2');
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
// GET OBJECT METADATA
// ============================================================================

async function getObjectMetadata() {
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

    // Get object metadata
    console.log('Getting metadata for object...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('');
    
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
    });

    const response = await client.send(command);
    
    console.log('Object Metadata:');
    console.log('Content Type: ' + (response.ContentType || 'N/A'));
    console.log('Content Length: ' + response.ContentLength + ' bytes');
    console.log('Last Modified: ' + response.LastModified);
    console.log('ETag: ' + response.ETag);
    
    if (response.Metadata && Object.keys(response.Metadata).length > 0) {
      console.log('');
      console.log('Custom Metadata:');
      for (const [key, value] of Object.entries(response.Metadata)) {
        console.log('  ' + key + ': ' + value);
      }
    }
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NotFound' || error.name === 'NoSuchKey') {
      console.error('Object does not exist.');
    } else if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    }
    process.exit(1);
  }
}

getObjectMetadata();
