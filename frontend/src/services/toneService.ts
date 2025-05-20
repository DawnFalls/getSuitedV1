// Author: Ehab Farhat - Alaa ElSet
// File: analyzeToneWithAssembly.ts
/*-- analyzeToneWithAssembly.ts ------------------------------------------------------

   This file defines the `analyzeToneWithAssembly` function, which uses the AssemblyAI 
   API to analyze the tone of a given audio blob. It performs sentiment analysis 
   through three main stages: upload, transcription, and polling for results.

   Features:
      - Uploads raw audio to AssemblyAI’s secure upload endpoint.
      - Requests transcription with sentiment analysis (disables emotion and entity detection).
      - Polls the API until transcription completes, handling errors and retries.
      - Returns the transcribed text, primary sentiment, and confidence score.

   Function:
      - analyzeToneWithAssembly(audioBlob: Blob): Promise<{ transcript: string, sentiment: string, confidence: number }>
          ▸ Accepts a WAV/MP3 audio blob.
          ▸ Uploads the file and requests a sentiment-based transcription.
          ▸ Polls until processing is complete.
          ▸ Returns the transcript, sentiment ("POSITIVE", "NEGATIVE", or "NEUTRAL"), and overall confidence.

   Notes:
      - Uses a hardcoded API key (`ASSEMBLY_API_KEY`) — move to `.env` for production.
      - AssemblyAI API documentation: https://docs.assemblyai.com
      - Only the first detected sentiment is returned.
      - Sentiment accuracy depends on speech clarity and duration.
      - Use `setTimeout` for a simple 3-second polling interval; can be optimized.

------------------------------------------------------------------------------------*/

import axios from 'axios';

const ASSEMBLY_API_KEY = '841f0d56728c491ea9762ba5b01b2519'; 

export const analyzeToneWithAssembly = async (audioBlob: Blob) => {
    try {
      // 1. Upload
      const uploadRes = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        audioBlob,
        {
          headers: {
            authorization: ASSEMBLY_API_KEY,
            'content-type': 'application/octet-stream',
          },
        }
      );
  
      const audioUrl = uploadRes.data.upload_url;
  
      const transcriptRes = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: audioUrl,
          sentiment_analysis: true,
          entity_detection: false,
          iab_categories: false,
          auto_highlights: false,
          speaker_labels: false,
        },
        {
          headers: {
            authorization: ASSEMBLY_API_KEY,
            'content-type': 'application/json',
          },
        }
      );
  
      const transcriptId = transcriptRes.data.id;
  
      let status = 'queued';
      let result;
      while (status !== 'completed') {
        const pollingRes = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: { authorization: ASSEMBLY_API_KEY },
          }
        );
        status = pollingRes.data.status;
        result = pollingRes.data;
  
        if (status === 'error') throw new Error(result.error);
        if (status !== 'completed') await new Promise((r) => setTimeout(r, 3000));
      }
  
      return {
        transcript: result.text,
        sentiment: result.sentiment_analysis_results?.[0]?.sentiment ?? 'neutral',
        confidence: result.confidence,
      };
    } catch (error: any) {
      console.error('❌ AssemblyAI error:', error.response?.data || error.message);
      throw error;
    }
  };