// Author: Ehab Farhat - Alaa ElSet
// File: uploadMiddleware.ts
/*-- uploadMiddleware.ts -------------------------------------------------------------

   This file configures and exports a Multer middleware for handling file uploads to 
   Amazon S3 using the AWS SDK v3 and `multer-s3`. It is used to handle profile 
   picture and evaluation document uploads in the application.

   Features:
      - Configures an S3 client for the `eu-north-1` region using credentials from 
        environment variables.
      - Sets up `multer-s3` storage to upload files to the `getsuitedbucket` bucket.
      - Automatically generates unique file keys using timestamp and original filename.
      - Attaches metadata to each uploaded file containing the field name.

   Upload Configuration:
      - Bucket: getsuitedbucket
      - Path format: uploads/{timestamp}-{originalName}
      - Field metadata: { fieldName: string }

   Environment Variables Required:
      - ACCESS_KEY_ID
      - SECRET_ACCESS_KEY

   Notes:
      - Exported middleware (`upload`) is used in routes that handle file uploads.
      - Supports `upload.single(fieldName)` for single-file form submissions.
      - Ensure bucket permissions and CORS settings allow PUT operations from your server.

------------------------------------------------------------------------------------*/

import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';

dotenv.config();

// AWS S3 Client v3
const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'getsuitedbucket',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});

export default upload;
