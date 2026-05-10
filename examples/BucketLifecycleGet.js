'use strict';

/**
 * IBM Cloud Object Storage - Get Bucket Lifecycle Configuration Example
 * 
 * This example demonstrates how to retrieve the lifecycle configuration
 * rules for a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketLifecycleGet.js
 */

const { S3Client, GetBucketLifecycleConfigurationCommand } = require('ibm-cos-sdk-v2');
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
// GET BUCKET LIFECYCLE CONFIGURATION
// ============================================================================

async function getBucketLifecycle() {
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

    console.log('Getting bucket lifecycle configuration...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('');
    
    const command = new GetBucketLifecycleConfigurationCommand({
      Bucket: BUCKET_NAME,
    });

    const response = await client.send(command);
    
    if (!response.Rules || response.Rules.length === 0) {
      console.log('No lifecycle rules configured for this bucket.');
      return;
    }
    
    console.log('Lifecycle Rules:');
    console.log('');
    
    for (const rule of response.Rules) {
      console.log('Rule ID: ' + (rule.ID || 'N/A'));
      console.log('Status: ' + rule.Status);
      
      if (rule.Prefix !== undefined) {
        console.log('Prefix: ' + (rule.Prefix || '(all objects)'));
      }
      
      if (rule.Filter) {
        if (rule.Filter.Prefix !== undefined) {
          console.log('Filter Prefix: ' + (rule.Filter.Prefix || '(all objects)'));
        }
        if (rule.Filter.Tag) {
          console.log('Filter Tag: ' + rule.Filter.Tag.Key + '=' + rule.Filter.Tag.Value);
        }
      }
      
      if (rule.Expiration) {
        if (rule.Expiration.Days) {
          console.log('Expiration: ' + rule.Expiration.Days + ' days');
        }
        if (rule.Expiration.Date) {
          console.log('Expiration Date: ' + rule.Expiration.Date);
        }
        if (rule.Expiration.ExpiredObjectDeleteMarker) {
          console.log('Delete Expired Object Delete Markers: Yes');
        }
      }
      
      if (rule.Transitions && rule.Transitions.length > 0) {
        console.log('Transitions:');
        for (const transition of rule.Transitions) {
          console.log('  Storage Class: ' + transition.StorageClass);
          if (transition.Days) {
            console.log('  After: ' + transition.Days + ' days');
          }
          if (transition.Date) {
            console.log('  Date: ' + transition.Date);
          }
        }
      }
      
      if (rule.NoncurrentVersionExpiration) {
        console.log('Noncurrent Version Expiration: ' + 
          rule.NoncurrentVersionExpiration.NoncurrentDays + ' days');
      }
      
      if (rule.AbortIncompleteMultipartUpload) {
        console.log('Abort Incomplete Multipart Upload: ' + 
          rule.AbortIncompleteMultipartUpload.DaysAfterInitiation + ' days');
      }
    }
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'NoSuchLifecycleConfiguration') {
      console.error('No lifecycle configuration found for this bucket.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

getBucketLifecycle();
