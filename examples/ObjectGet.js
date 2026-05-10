'use strict';

/**
 * IBM Cloud Object Storage - Download Object Example
 * 
 * This example demonstrates how to download a file from a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectGet.js
 */

const { S3Client, GetObjectCommand } = require('ibm-cos-sdk-v2');
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
const DOWNLOAD_PATH = './downloaded-file.txt';

// ============================================================================
// DOWNLOAD OBJECT
// ============================================================================

async function downloadObject() {
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

    // Download object
    console.log('Downloading object...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
    });

    const response = await client.send(command);
    
    // Convert stream to buffer and save to file
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    fs.writeFileSync(DOWNLOAD_PATH, buffer);
    
    console.log('Object downloaded successfully');
    console.log('Saved to: ' + DOWNLOAD_PATH);
    console.log('Size: ' + buffer.length + ' bytes');
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchKey') {
      console.error('Object does not exist.');
    } else if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    }
    process.exit(1);
  }
}

downloadObject();
