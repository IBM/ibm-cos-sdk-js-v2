'use strict';

/**
 * IBM Cloud Object Storage - Get Object Version Example
 * 
 * This example demonstrates how to retrieve a specific version of an object
 * from a versioning-enabled bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectVersioningGet.js
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
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-versioned-bucket';
const OBJECT_KEY = process.env.OBJECT_KEY || 'my-file.txt';
const VERSION_ID = process.env.VERSION_ID || 'YOUR_VERSION_ID_HERE';
const DESTINATION_FILE = process.env.DESTINATION_FILE || './downloaded-version.txt';

// ============================================================================
// GET OBJECT VERSION
// ============================================================================

async function getObjectVersion() {
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

    console.log('Getting specific version of object...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('Version ID: ' + VERSION_ID);
    console.log('Destination: ' + DESTINATION_FILE);
    console.log('');
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      VersionId: VERSION_ID,
    });

    const response = await client.send(command);
    
    // Save to file
    const writeStream = fs.createWriteStream(DESTINATION_FILE);
    response.Body.pipe(writeStream);
    
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    
    console.log('Object version downloaded successfully!');
    console.log('');
    console.log('Version Metadata:');
    console.log('Content Type: ' + (response.ContentType || 'N/A'));
    console.log('Content Length: ' + response.ContentLength + ' bytes');
    console.log('Last Modified: ' + response.LastModified);
    console.log('ETag: ' + response.ETag);
    console.log('Version ID: ' + response.VersionId);
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NotFound' || error.name === 'NoSuchKey') {
      console.error('Object or version does not exist.');
    } else if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'NoSuchVersion') {
      console.error('Specified version does not exist.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

getObjectVersion();
