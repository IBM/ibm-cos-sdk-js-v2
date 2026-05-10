'use strict';

/**
 * IBM Cloud Object Storage - Upload Object Example
 * 
 * This example demonstrates how to upload a file to a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectPut.js
 */

const { S3Client, PutObjectCommand } = require('ibm-cos-sdk-v2');
const fs = require('fs');
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
const FILE_PATH = process.env.FILE_PATH || './test-file.txt';

// ============================================================================
// UPLOAD OBJECT
// ============================================================================

async function uploadObject() {
  try {
    // Check if file exists
    if (!fs.existsSync(FILE_PATH)) {
      console.error('Error: File not found: ' + FILE_PATH);
      return;
    }

    // Initialize client
    const client = new S3Client({
      endpoint: ENDPOINT,
      region: REGION,
      credentials: {
        apiKey: API_KEY,
        serviceInstanceId: SERVICE_INSTANCE_ID,
      },
    });

    // Upload object
    console.log('Uploading object...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('File: ' + FILE_PATH);
    
    const fileContent = fs.readFileSync(FILE_PATH);
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      Body: fileContent,
    });

    const response = await client.send(command);
    
    console.log('Object uploaded successfully');
    if (response.ETag) {
      console.log('ETag: ' + response.ETag);
    }
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    }
    
    process.exit(1);
  }
}

uploadObject();
