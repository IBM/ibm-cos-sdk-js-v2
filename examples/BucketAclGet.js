'use strict';

/**
 * IBM Cloud Object Storage - Get Bucket ACL Example
 * 
 * This example demonstrates how to retrieve the Access Control List (ACL)
 * for a bucket.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node BucketAclGet.js
 */

const { S3Client, GetBucketAclCommand } = require('ibm-cos-sdk-v2');
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
// GET BUCKET ACL
// ============================================================================

async function getBucketAcl() {
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

    console.log('Getting bucket ACL...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('');
    
    const command = new GetBucketAclCommand({
      Bucket: BUCKET_NAME,
    });

    const response = await client.send(command);
    
    // Display owner information
    if (response.Owner) {
      console.log('Owner:');
      console.log('  ID: ' + response.Owner.ID);
      if (response.Owner.DisplayName) {
        console.log('  Display Name: ' + response.Owner.DisplayName);
      }
    }
    
    // Display grants
    if (response.Grants && response.Grants.length > 0) {
      console.log('Grants:');
      for (const grant of response.Grants) {
        console.log('  Permission: ' + grant.Permission);
        
        if (grant.Grantee) {
          console.log('  Grantee Type: ' + grant.Grantee.Type);
          
          if (grant.Grantee.ID) {
            console.log('  Grantee ID: ' + grant.Grantee.ID);
          }
          
          if (grant.Grantee.DisplayName) {
            console.log('  Grantee Display Name: ' + grant.Grantee.DisplayName);
          }
          
          if (grant.Grantee.URI) {
            console.log('  Grantee URI: ' + grant.Grantee.URI);
          }
          
          if (grant.Grantee.EmailAddress) {
            console.log('  Grantee Email: ' + grant.Grantee.EmailAddress);
          }
        }
      }
    } else {
      console.log('No grants found.');
    }
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

getBucketAcl();
