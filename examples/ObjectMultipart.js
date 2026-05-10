'use strict';

/**
 * IBM Cloud Object Storage - Multipart Upload Example
 * 
 * This example demonstrates how to upload a large file using multipart upload.
 * Multipart upload is recommended for files larger than 100MB.
 * 
 * Configuration can be provided via:
 * - Environment variables (recommended)
 * - Direct replacement: Update the constants below
 * 
 * Run: node ObjectMultipart.js
 */

const { 
  S3Client, 
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} = require('ibm-cos-sdk-v2');
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
const OBJECT_KEY = process.env.OBJECT_KEY || 'large-file.bin';
const FILE_PATH = process.env.FILE_PATH || './test-file.txt';

// Multipart upload settings
const PART_SIZE = 5 * 1024 * 1024; // 5MB minimum part size

// ============================================================================
// MULTIPART UPLOAD
// ============================================================================

async function multipartUpload() {
  let uploadId;
  
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

    // Check if file exists
    if (!fs.existsSync(FILE_PATH)) {
      throw new Error('File not found: ' + FILE_PATH);
    }

    const fileStats = fs.statSync(FILE_PATH);
    const fileSize = fileStats.size;
    
    console.log('Starting multipart upload...');
    console.log('Bucket: ' + BUCKET_NAME);
    console.log('Object Key: ' + OBJECT_KEY);
    console.log('File: ' + FILE_PATH);
    console.log('File Size: ' + fileSize + ' bytes');
    console.log('Part Size: ' + PART_SIZE + ' bytes');
    console.log('');

    // Step 1: Initiate multipart upload
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
    });

    const createResponse = await client.send(createCommand);
    uploadId = createResponse.UploadId;
    
    console.log('Multipart upload initiated.');
    console.log('Upload ID: ' + uploadId);
    console.log('');

    // Step 2: Upload parts
    const parts = [];
    const totalParts = Math.ceil(fileSize / PART_SIZE);
    
    console.log('Uploading ' + totalParts + ' part(s)...');
    
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * PART_SIZE;
      const end = Math.min(start + PART_SIZE, fileSize);
      const partSize = end - start;
      
      // Read part from file
      const buffer = Buffer.alloc(partSize);
      const fd = fs.openSync(FILE_PATH, 'r');
      fs.readSync(fd, buffer, 0, partSize, start);
      fs.closeSync(fd);
      
      // Upload part
      const uploadPartCommand = new UploadPartCommand({
        Bucket: BUCKET_NAME,
        Key: OBJECT_KEY,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: buffer,
      });

      const uploadPartResponse = await client.send(uploadPartCommand);
      
      parts.push({
        PartNumber: partNumber,
        ETag: uploadPartResponse.ETag,
      });
      
      console.log('Part ' + partNumber + ' uploaded (' + partSize + ' bytes)');
    }
    
    console.log('');

    // Step 3: Complete multipart upload
    console.log('Completing multipart upload...');
    
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    });

    const completeResponse = await client.send(completeCommand);
    
    console.log('Multipart upload completed successfully!');
    console.log('ETag: ' + completeResponse.ETag);
    console.log('Location: ' + completeResponse.Location);
    
  } catch (error) {
    console.error('Error: ' + error.message);
    
    // Abort multipart upload on error
    if (uploadId) {
      try {
        console.log('');
        console.log('Aborting multipart upload...');
        
        const client = new S3Client({
          endpoint: ENDPOINT,
          credentials: {
            apiKey: API_KEY,
            serviceInstanceId: SERVICE_INSTANCE_ID,
          },
        });
        
        const abortCommand = new AbortMultipartUploadCommand({
          Bucket: BUCKET_NAME,
          Key: OBJECT_KEY,
          UploadId: uploadId,
        });

        await client.send(abortCommand);
        console.log('Multipart upload aborted.');
      } catch (abortError) {
        console.error('Failed to abort multipart upload: ' + abortError.message);
        process.exit(1);
      }
    }
    
    if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist.');
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied. Check your credentials and permissions.');
    }
    process.exit(1);
  }
}

multipartUpload();
