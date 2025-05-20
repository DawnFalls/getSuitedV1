// Author: Ehab Farhat - Alaa ElSet
// File: EmailController.ts
/*-- EmailController.ts --------------------------------------------------------------

   This file defines the `EmailController`, an Express controller responsible for 
   handling file upload and email delivery with attachments. It leverages `multer` 
   for handling multipart form-data uploads and delegates email delivery to 
   `EmailService`.

   Features:
      - Accepts file uploads (e.g., PDF reports) via multipart/form-data.
      - Sends an email with the uploaded file as an attachment.
      - Deletes the uploaded file from the server after email dispatch.
      - Handles request validation and error logging.

   Endpoints:
      - POST /sendEmail/
          ▸ Sends an email with an attached file.
          ▸ Request body: multipart/form-data with fields:
              - `email` (string): Recipient's email address
              - `file` (File): Uploaded file (e.g., a PDF report)
          ▸ Response: {
              message: string,
              result: any
            }

   Notes:
      - Uses `multer` middleware to handle file upload to the `uploads/` directory.
      - Automatically removes uploaded file after the email is sent to save disk space.
      - Requires `EmailService` to implement `sendEmail(email, filePath)`.

------------------------------------------------------------------------------------*/

import { controller, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../config/types';
import fs from 'fs';
import EmailService from '../services/emailService'; 

// Multer configuration for handling file uploads
import multer from 'multer';

// Configure multer to store uploaded files in the 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

@controller('/sendEmail')
export default class EmailController {
  constructor(@inject(TYPES.EmailService) private emailService: EmailService) {}

  @httpPost('/', upload.single('file'))  // Use multer middleware to handle file uploads
  async sendEmail(@request() req: Request, @response() res: Response) {
    try {
      const { email } = req.body;  // Get the email from the request body
      const file = req.file; 

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Send the email with the attached PDF file
      const filePath = file.path; 
      const result = await this.emailService.sendEmail(email, filePath);  // Pass the file path to EmailService

      // Clean up the file after sending the email
      fs.unlinkSync(filePath);  // Remove the file after sending email

      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error) {
      console.error('Error in sendEmail controller:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  }
}