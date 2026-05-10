'use strict';

/**
 * IBM Cloud Object Storage - Create Bucket with Object Lock Example
 * 
 * This example demonstrates how to create a bucket with Object Lock enabled.
 * Object Lock must be enabled at bucket creation time and cannot be added later.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketCreateWithObjectLock.js
 */

const { S3Client, CreateBucketCommand, PutObjectLockConfigurationCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-locked-bucket';
const REGION = process.env.REGION || 'us-south';

// Object Lock configuration
const LOCK_ENABLED = true;
const RETENTION_MODE = 'GOVERNANCE'; // GOVERNANCE or COMPLIANCE
const RETENTION_DAYS = 30;

// ============================================================================
// CREATE BUCKET WITH OBJECT LOCK
// ============================================================================

async function createBucketWithObjectLock() {
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

    console.log('Creating bucket with Object Lock...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('');

    // Step 1: Create bucket with Object Lock enabled
    const createCommand = new CreateBucketCommand({
      Bucket: BUCKET_NAME,
      ObjectLockEnabledForBucket: LOCK_ENABLED,
    });

    await client.send(createCommand);
    console.log('Bucket created successfully with Object Lock enabled!');
    console.log('');

    // Step 2: Set default Object Lock configuration
    console.log('Setting default Object Lock configuration...');
    console.log('Retention Mode: ' + RETENTION_MODE);
    console.log('Retention Period: ' + RETENTION_DAYS + ' days');
    console.log('');
    
    const lockConfigCommand = new PutObjectLockConfigurationCommand({
      Bucket: BUCKET_NAME,
      ObjectLockConfiguration: {
        ObjectLockEnabled: 'Enabled',
        Rule: {
          DefaultRetention: {
            Mode: RETENTION_MODE,
            Days: RETENTION_DAYS,
          },
        },
      },
    });

    await client.send(lockConfigCommand);
    
    console.log('Object Lock configuration set successfully!');
    console.log('');
    console.log('Bucket Configuration:');
    console.log('- Object Lock: Enabled');
    console.log('- Default Retention Mode: ' + RETENTION_MODE);
    console.log('- Default Retention Period: ' + RETENTION_DAYS + ' days');
    console.log('');
    console.log('Note: All objects uploaded to this bucket will automatically');
    console.log('have the default retention settings applied.');
    console.log('');
    console.log('GOVERNANCE mode: Can be overridden by users with special permissions');
    console.log('COMPLIANCE mode: Cannot be removed until retention period expires');
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'BucketAlreadyExists') {
      console.error('Bucket already exists.');
    } else if (error.name === 'BucketAlreadyOwnedByYou') {
      console.error('Bucket already exists and is owned by you.');
    } else if (error.name === 'InvalidBucketName') {
      console.error('Invalid bucket name. Use lowercase letters, numbers, and hyphens only.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

createBucketWithObjectLock();

// Made with Bob
