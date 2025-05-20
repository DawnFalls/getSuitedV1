// Author: Ehab Farhat - Alaa ElSet
// File: analyzeAudioWithDeepgram.ts
/*-- analyzeAudioWithDeepgram.ts -----------------------------------------------------

   This file defines the `analyzeAudioWithDeepgram` function, which sends a WAV audio 
   Blob to the Deepgram Speech-to-Text API for real-time transcription. The function 
   handles the conversion and submission of audio data and returns the parsed 
   transcription result.

   Features:
      - Converts an incoming audio Blob to an ArrayBuffer.
      - Sends a POST request to Deepgram’s `/listen` endpoint with punctuation enabled.
      - Handles and parses the API response, returning transcription data.
      - Throws an error if the API request fails.

   Method:
      - analyzeAudioWithDeepgram(audioBlob: Blob): Promise<any>
          ▸ Accepts a WAV audio Blob.
          ▸ Transmits the data to Deepgram API.
          ▸ Returns JSON transcription result.

   Notes:
      - Uses hardcoded API key for testing; replace with `process.env.REACT_APP_DEEPGRAM_API_KEY` in production.
      - Content-Type must be `audio/wav` for accurate processing.
      - Requires network access and permission to call external APIs.
      - Deepgram account and API key required for usage:
        https://developers.deepgram.com

------------------------------------------------------------------------------------*/

export const analyzeAudioWithDeepgram = async (audioBlob: Blob) => {
    // const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
    const apiKey = '77a3dc3f657f87560ba86ab6f676b543f0a61915';
    console.log(apiKey)
    
    const arrayBuffer = await audioBlob.arrayBuffer();
  
    const response = await fetch('https://api.deepgram.com/v1/listen?punctuate=true', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'audio/wav', // WAV!
      },
      body: arrayBuffer,
    });
  
    if (!response.ok) {
      throw new Error('Deepgram API Error');
    }
  
    const data = await response.json();
    return data;
  };