'use strict';

/**
 * IBM Cloud Object Storage - Get Object Lock Configuration Example
 * 
 * This example demonstrates how to retrieve the Object Lock configuration
 * and retention settings for an object.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectLockGet.js
 */

const { S3Client, GetObjectRetentionCommand, GetObjectLegalHoldCommand } = require('ibm-cos-sdk-v2');
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

// ============================================================================
// GET OBJECT LOCK CONFIGURATION
// ============================================================================

async function getObjectLockConfiguration() {
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

    console.log('Getting Object Lock configuration...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('');

    // Get object retention
    try {
      console.log('--- Object Retention ---');
      const retentionCommand = new GetObjectRetentionCommand({
        Bucket: BUCKET_NAME,
        Key: OBJECT_KEY,
      });

      const retentionResponse = await client.send(retentionCommand);
      
      if (retentionResponse.Retention) {
        console.log('Mode: ' + retentionResponse.Retention.Mode);
        console.log('Retain Until Date: ' + retentionResponse.Retention.RetainUntilDate);
      } else {
        console.log('No retention configuration found.');
      }
    } catch (retentionError) {
      if (retentionError.name === 'NoSuchObjectLockConfiguration') {
        console.log('No retention configuration found.');
      } else {
        throw retentionError;
      }
    }

    console.log('');

    // Get legal hold status
    try {
      console.log('--- Legal Hold Status ---');
      const legalHoldCommand = new GetObjectLegalHoldCommand({
        Bucket: BUCKET_NAME,
        Key: OBJECT_KEY,
      });

      const legalHoldResponse = await client.send(legalHoldCommand);
      
      if (legalHoldResponse.LegalHold) {
        console.log('Status: ' + legalHoldResponse.LegalHold.Status);
      } else {
        console.log('No legal hold found.');
      }
    } catch (legalHoldError) {
      if (legalHoldError.name === 'NoSuchObjectLockConfiguration') {
        console.log('No legal hold found.');
      } else {
        throw legalHoldError;
      }
    }

    console.log('');
    console.log('Note: Object Lock prevents objects from being deleted or overwritten');
    console.log('for a specified retention period or indefinitely with legal hold.');
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NotFound' || error.name === 'NoSuchKey') {
      console.error('Object does not exist.');
    } else if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'ObjectLockConfigurationNotFoundError') {
      console.error('Object Lock is not enabled on this bucket.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

getObjectLockConfiguration();
