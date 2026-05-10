'use strict';

/**
 * IBM Cloud Object Storage - Put Object with Versioning Example
 * 
 * This example demonstrates how to upload an object to a versioning-enabled bucket.
 * Each upload creates a new version of the object.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectVersioningPut.js
 */

const { S3Client, PutObjectCommand, PutBucketVersioningCommand } = require('ibm-cos-sdk-v2');
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
const FILE_PATH = process.env.FILE_PATH || './test-file.txt';

// ============================================================================
// PUT OBJECT WITH VERSIONING
// ============================================================================

async function putObjectWithVersioning() {
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

    console.log('Uploading object to versioned bucket...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('File: ' + FILE_PATH);
    console.log('');

    // Check if file exists
    if (!fs.existsSync(FILE_PATH)) {
      throw new Error('File not found: ' + FILE_PATH);
    }

    // Read file
    const fileContent = fs.readFileSync(FILE_PATH);

    // Enable versioning on the bucket
    var command = new PutBucketVersioningCommand({
      Bucket: BUCKET_NAME,
      VersioningConfiguration: {
        Status: 'Enabled'
      },
    })
    var response = await client.send(command);
    console.log('Versioning enabled on bucket:', BUCKET_NAME);
    console.log('');
    
    command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      Body: fileContent,
    });

    response = await client.send(command);
    
    console.log('Object uploaded successfully!');
    console.log('');
    console.log('Upload Details:');
    console.log('ETag: ' + response.ETag);
    console.log('Version ID: ' + (response.VersionId || 'N/A (versioning may not be enabled)'));
    console.log('');
    console.log('Note: Each upload to a versioning-enabled bucket creates a new version.');
    console.log('Previous versions are retained and can be retrieved using their version IDs.');
    
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

putObjectWithVersioning();
