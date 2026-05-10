'use strict';

/**
 * IBM Cloud Object Storage - Delete Object Version Example
 * 
 * This example demonstrates how to delete a specific version of an object
 * from a versioning-enabled bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectVersioningDelete.js
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
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-versioned-bucket';
const OBJECT_KEY = process.env.OBJECT_KEY || 'my-file.txt';
const VERSION_ID = process.env.VERSION_ID || 'YOUR_VERSION_ID_HERE';

// ============================================================================
// DELETE OBJECT VERSION
// ============================================================================

async function deleteObjectVersion() {
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

    console.log('Deleting specific version of object...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('Version ID: ' + VERSION_ID);
    console.log('');
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      VersionId: VERSION_ID,
    });

    const response = await client.send(command);
    
    console.log('Object version deleted successfully!');
    console.log('');
    console.log('Deletion Details:');
    console.log('Deleted Version ID: ' + (response.VersionId || VERSION_ID));
    console.log('Delete Marker: ' + (response.DeleteMarker ? 'Yes' : 'No'));
    console.log('');
    console.log('Note: Deleting a specific version permanently removes that version.');
    console.log('Other versions of the object remain intact.');
    
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

deleteObjectVersion();
