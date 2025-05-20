// Author: Ehab Farhat - Alaa ElSet
// File: trainingService.ts
/*-- trainingService.ts --------------------------------------------------------------

   This file defines client-side utility functions for interacting with the AI-powered 
   training and evaluation system. It enables uploading transcripts, receiving career 
   advice, and retrieving stored evaluation reports from the backend.

   Features:
      - Submits user prompts and optional transcripts to receive career guidance via AI.
      - Supports uploading PDF interview transcripts (from file or URL) for analysis.
      - Retrieves previously saved evaluation reports for a given user by email.

   API Base:
      - `http://localhost:5001/api`

   Functions:
      - fetchCareerAdvice(userMessage, transcriptText?)
          ▸ Sends a chat prompt and optional transcript to `/training/chat`.
          ▸ Returns an AI-generated career coaching response.

      - uploadInterviewTranscript(file | { url })
          ▸ Uploads a transcript as a file or by URL to `/training/uploadTranscript`.
          ▸ Uses `multipart/form-data` or JSON based on input type.

      - fetchUserEvaluations(email)
          ▸ Retrieves a user's evaluation records using their email.
          ▸ Sends an authenticated GET request to `/users/evaluations`.

   Notes:
      - All `/training` requests use `/api` prefix; `/users/evaluations` does not.
      - JWT token must be stored in `localStorage` as `token` for authenticated requests.
      - Make sure CORS and token middleware are properly configured on the backend.

------------------------------------------------------------------------------------*/

import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export const fetchCareerAdvice = async (
  userMessage: string,
  transcriptText?: string
): Promise<string> => {
  try {
    const payload: any = { prompt: userMessage };
    if (transcriptText) payload.transcriptText = transcriptText;

    const response = await axios.post(
      `${API_BASE}/training/chat`,
      payload,
    );

    return (
      response.data.text ||
      "Sorry, I didn't catch that. Could you please ask about career-related topics?"
    );
  } catch (error) {
    console.error('Error fetching career advice:', error);
    throw new Error('Failed to get career advice.');
  }
};

export const uploadInterviewTranscript = async (
  file: File | { url: string }
): Promise<void> => {
  if ('url' in file) {
    await axios.post(
      `${API_BASE}/training/uploadTranscript`,
      { url: file.url },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } else {
    // Upload File
    const form = new FormData();
    form.append('transcript', file as File);
    await axios.post(
      `${API_BASE}/training/uploadTranscript`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
};

export const fetchUserEvaluations = async (email: string) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `http://localhost:5001/users/evaluations`,   // 👈 no /api
      {
        params: { email },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error('Error fetching evaluations:', err);
    throw new Error('Failed to fetch evaluation reports.');
  }
};
