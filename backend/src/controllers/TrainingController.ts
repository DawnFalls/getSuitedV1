// Author: Ehab Farhat - Alaa ElSet
// File: TrainingController.ts
/*-- TrainingController.ts -----------------------------------------------------------

   This file defines the `TrainingController`, an Express controller that handles the 
   training and career coaching module. It supports uploading interview transcripts 
   and interacting with a Groq-hosted AI model to provide career guidance and feedback.

   Features:
      - Allows users to upload or link to a transcript in PDF format.
      - Parses and stores transcript content for later AI-assisted conversation.
      - Provides a chat interface that uses the stored transcript and user prompt 
        to generate job-specific coaching feedback using the LLaMA3-70B model.

   Endpoints:
      - POST /api/training/uploadTranscript
          ▸ Accepts a local file (multipart/form-data) or a remote PDF URL.
          ▸ Parses the PDF and stores transcript content in memory.
          ▸ Request: file or { url: string }
          ▸ Response: { message: string }

      - POST /api/training/chat
          ▸ Accepts a user prompt and (optionally) a transcriptText override.
          ▸ Sends combined data to Groq AI for context-aware response.
          ▸ Request body: {
              prompt: string,
              transcriptText?: string
            }
          ▸ Response: { text: string }

   Notes:
      - Uses `multer` for handling file uploads.
      - Uses `pdf-parse` for extracting text from PDFs.
      - `node-fetch` is used to download remote PDF files.
      - Temporary in-memory storage (`transcripts`) should be replaced with 
        persistent storage in production.
      - Requires `GROQ_API_KEY` environment variable to function correctly.

------------------------------------------------------------------------------------*/

import { controller, httpPost, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import fetch from 'node-fetch';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });
// In-memory store for transcripts; replace with persistent storage in production
const transcripts: Record<string, string> = {};

@controller('/api/training')
export class TrainingController {
  @httpPost('/uploadTranscript', upload.single('transcript'))
public async uploadTranscript(@request() req: Request, @response() res: Response): Promise<void> {
  try {
    let text: string;

    if (req.file) {
      // local PDF upload
      const buffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(buffer);
      text = parsed.text;
      fs.unlinkSync(req.file.path);

    } else if (req.body.url) {
      // remote PDF URL 
      const pdfRes = await fetch(req.body.url);
      if (!pdfRes.ok) {
        res.status(400).json({ error: 'Could not download PDF from URL' });
        return;
      }
      const buffer = await pdfRes.buffer();
      const parsed = await pdfParse(buffer);
      text = parsed.text;

    } else {
      res.status(400).json({ error: 'No transcript provided' });
      return;
    }

    transcripts['default'] = text;          
    res.json({ message: 'Transcript received and stored.' });

  } catch (err: any) {
    console.error('uploadTranscript error:', err);
    res.status(500).json({ error: 'Failed to process transcript' });
  }
}

  @httpPost('/chat')
  public async chat(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { prompt, transcriptText } = req.body;
      // Fallback to stored transcript if none directly provided
      const textForAnalysis = transcriptText ?? transcripts['default'];

      // Build message history
      const messages: { role: string; content: string }[] = [
        { role: 'system', content: 'You are a professional career coach and interview evaluator.' }
      ];
      if (textForAnalysis) {
        messages.push({
          role: 'system',
          content: `Interview transcript for analysis:\n\n${textForAnalysis}`
        });
      }
      // User's actual query
      messages.push({
        role: 'user',
        content: `User's query: ${prompt}\nPlease respond as a helpful career coach, staying focused on job/career matters.`
      });

      // Send to AI
      const aiResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const generatedText = aiResponse.data.choices?.[0]?.message?.content;
      if (!generatedText) {
        res.status(500).json({ error: 'No response generated' });
        return;
      }
      res.json({ text: generatedText });
    } catch (err: any) {
      console.error('chat error:', err.response?.data || err.message);
      res.status(500).json({ error: 'Failed to fetch career advice' });
    }
  }
}