'use strict';

/**
 * IBM Cloud Object Storage - Put Bucket Lifecycle Configuration Example
 * 
 * This example demonstrates how to set lifecycle rules for a bucket to
 * automatically manage object expiration and transitions.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketLifecyclePut.js
 */

const { S3Client, PutBucketLifecycleConfigurationCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket';
const REGION = process.env.REGION || 'us-south';

// ============================================================================
// PUT BUCKET LIFECYCLE CONFIGURATION
// ============================================================================

async function putBucketLifecycle() {
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

    console.log('Setting bucket lifecycle configuration...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('');

    // Define lifecycle rules
    const lifecycleRules = [
      {
        ID: 'delete-old-logs',
        Status: 'Enabled',
        Filter: {
          Prefix: 'logs/',
        },
        Expiration: {
          Days: 30,
        },
      },
      {
        ID: 'cleanup-multipart-uploads',
        Status: 'Enabled',
        Filter: {
          Prefix: '',
        },
        AbortIncompleteMultipartUpload: {
          DaysAfterInitiation: 7,
        },
      },
    ];

    console.log('Lifecycle Rules to Apply:');
    for (const rule of lifecycleRules) {
      console.log('- ' + rule.ID + ' (' + rule.Status + ')');
    }
    console.log('');
    
    const command = new PutBucketLifecycleConfigurationCommand({
      Bucket: BUCKET_NAME,
      LifecycleConfiguration: {
        Rules: lifecycleRules,
      },
    });

    await client.send(command);
    
    console.log('Bucket lifecycle configuration set successfully!');
    console.log('');
    console.log('Rule Details:');
    console.log('1. delete-old-logs: Deletes objects in logs/ after 30 days');
    console.log('2. cleanup-multipart-uploads: Aborts incomplete multipart uploads after 7 days');
    console.log('');
    console.log('Note: Lifecycle rules are evaluated once per day.');
    
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

putBucketLifecycle();
