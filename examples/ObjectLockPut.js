'use strict';

/**
 * IBM Cloud Object Storage - Put Object Lock Configuration Example
 * 
 * This example demonstrates how to set Object Lock retention and legal hold
 * on an object to prevent deletion or modification.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectLockPut.js
 */

const { S3Client, PutObjectRetentionCommand, PutObjectLegalHoldCommand } = require('ibm-cos-sdk-v2');
require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const SERVICE_INSTANCE_ID = process.env.SERVICE_INSTANCE_ID || 'YOUR_SERVICE_INSTANCE_CRN_HERE';
const ENDPOINT = process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud';
const REGION = process.env.REGION || 'us-south';
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-locked-bucket';
const OBJECT_KEY = process.env.OBJECT_KEY || 'my-file.txt';

// Retention settings
const RETENTION_MODE = 'GOVERNANCE'; // GOVERNANCE or COMPLIANCE
const RETENTION_DAYS = 30; // Number of days to retain

// Legal hold setting
const LEGAL_HOLD_STATUS = 'ON'; // ON or OFF

// ============================================================================
// PUT OBJECT LOCK CONFIGURATION
// ============================================================================

async function putObjectLockConfiguration() {
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

    console.log('Setting Object Lock configuration...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('');

    // Set object retention
    console.log('--- Setting Object Retention ---');
    const retainUntilDate = new Date();
    retainUntilDate.setDate(retainUntilDate.getDate() + RETENTION_DAYS);
    
    console.log('Mode: ' + RETENTION_MODE);
    console.log('Retain Until: ' + retainUntilDate.toISOString());
    
    const retentionCommand = new PutObjectRetentionCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      Retention: {
        Mode: RETENTION_MODE,
        RetainUntilDate: retainUntilDate,
      },
    });

    await client.send(retentionCommand);
    console.log('Object retention set successfully!');
    console.log('');

    // Set legal hold
    console.log('--- Setting Legal Hold ---');
    console.log('Status: ' + LEGAL_HOLD_STATUS);
    
    const legalHoldCommand = new PutObjectLegalHoldCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      LegalHold: {
        Status: LEGAL_HOLD_STATUS,
      },
    });

    await client.send(legalHoldCommand);
    console.log('Legal hold set successfully!');
    console.log('');

    console.log('Object Lock Configuration Summary:');
    console.log('- Retention Mode: ' + RETENTION_MODE);
    console.log('- Retention Period: ' + RETENTION_DAYS + ' days');
    console.log('- Legal Hold: ' + LEGAL_HOLD_STATUS);
    console.log('');
    console.log('Note: GOVERNANCE mode allows users with special permissions to override.');
    console.log('COMPLIANCE mode cannot be removed until retention period expires.');
    console.log('Legal hold prevents deletion regardless of retention settings.');
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NotFound' || error.name === 'NoSuchKey') {
      console.error('Object does not exist.');
    } else if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'ObjectLockConfigurationNotFoundError') {
      console.error('Object Lock is not enabled on this bucket.');
      console.error('Enable Object Lock when creating the bucket.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

putObjectLockConfiguration();
