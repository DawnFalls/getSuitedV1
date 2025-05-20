// Author: Ehab Farhat - Alaa ElSet
// File: EmailService.ts
/*-- EmailService.ts -----------------------------------------------------------------

   This file defines the `EmailService` class, responsible for sending emails with 
   PDF attachments using the `nodemailer` library and a Zoho SMTP server. It is used 
   to deliver evaluation results to candidates after interviews.

   Features:
      - Configures an SMTP transporter using Zoho mail settings.
      - Sends an email with a static subject and body, attaching a PDF file.
      - Reads PDF file content as a buffer using Node's `fs` module.
      - Logs email delivery results and handles sending errors gracefully.

   Method:
      - sendEmail(recipientEmail: string, filePath: string): Promise<any>
          ▸ Reads the specified PDF file.
          ▸ Sends it as an attachment to the recipient’s email.
          ▸ Returns `nodemailer` response or throws an error if failed.

   Configuration:
      - SMTP Host: smtp.zoho.com
      - Port: 587 (TLS)
      - Authentication: EMAIL_USER and EMAIL_PASS (from `.env`)

   Notes:
      - Decorated with `@injectable()` for InversifyJS dependency injection.
      - Uses plain text and a fixed subject; can be extended for customization.
      - File should exist at `filePath` when method is invoked.
      - Ensure environment variables are properly set in production.

------------------------------------------------------------------------------------*/

import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import fs from 'fs'; 
import 'reflect-metadata';

@injectable()
export default class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',  
      port: 587,               
      secure: false,           
      auth: {
        user: process.env.EMAIL_USER,   
        pass: process.env.EMAIL_PASS,   
      },
    });
  }

  // Function to send email with PDF attachment
  public async sendEmail(recipientEmail: string, filePath: string): Promise<any> {
    // Read the PDF file into a Buffer
    const pdfBuffer = fs.readFileSync(filePath);

    const mailOptions = {
      from: process.env.EMAIL_USER,   
      to: recipientEmail,            
      subject: 'Interview Evaluation PDF',
      text: 'Please find attached the evaluation PDF for your interview.',
      attachments: [
        {
          filename: 'interview_evaluation.pdf',  // Name of the attached file
          content: pdfBuffer,   // Attach the PDF content as a Buffer
        },
      ],
    };

    try {
      // Send the email using the transporter
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);   
      return info;
    } catch (error) {
      console.error('Error sending email:', error);   
      throw new Error('Email sending failed');
    }
  }
}