'use strict';

/**
 * IBM Cloud Object Storage - Object with Custom Metadata Example
 * 
 * This example demonstrates how to upload an object with custom metadata
 * and retrieve that metadata.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectMetadata.js
 */

const { S3Client, PutObjectCommand, HeadObjectCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const REGION = process.env.REGION || 'us-south';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket';
const OBJECT_KEY = process.env.OBJECT_KEY || 'metadata-test.txt';

// ============================================================================
// OBJECT WITH CUSTOM METADATA
// ============================================================================

async function objectWithMetadata() {
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

    // Upload object with custom metadata
    console.log('Uploading object with custom metadata...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('');
    
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      Body: 'This is a test file with custom metadata.',
      ContentType: 'text/plain',
      Metadata: {
        'author': 'John Doe',
        'department': 'Engineering',
        'project': 'IBM COS SDK Examples',
        'version': '1.0',
      },
    });

    await client.send(putCommand);
    console.log('Object uploaded successfully with custom metadata.');
    console.log('');

    // Retrieve object metadata
    console.log('Retrieving object metadata...');
    
    const headCommand = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
    });

    const response = await client.send(headCommand);
    
    console.log('Object Metadata:');
    console.log('Content Type: ' + response.ContentType);
    console.log('Content Length: ' + response.ContentLength + ' bytes');
    console.log('Last Modified: ' + response.LastModified);
    console.log('ETag: ' + response.ETag);
    console.log('');
    
    if (response.Metadata && Object.keys(response.Metadata).length > 0) {
      console.log('Custom Metadata:');
      for (const [key, value] of Object.entries(response.Metadata)) {
        console.log('  ' + key + ': ' + value);
      }
    } else {
      console.log('No custom metadata found.');
    }
    
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

objectWithMetadata();
