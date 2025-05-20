// Author: Ehab Farhat - Alaa ElSet
// File: saveEvaluation.ts
/*-- saveEvaluation.ts ---------------------------------------------------------------

   This file defines the `saveEvaluation` function, which sends a structured set of 
   interview evaluation results (including audio, transcript, and body language data) 
   to the backend for persistent storage.

   Features:
      - Defines types for body language metrics and full evaluation results.
      - Prepares a JSON payload containing the user ID and evaluation data.
      - Sends the evaluation data to the `/api/save-evaluation` endpoint via POST.

   Types:
      - BodyLanguageMetrics:
          ▸ smilingScore (number): Quantifies smile detection.
          ▸ eyeContact (boolean): Indicates if eye contact was maintained.
          ▸ emotion (string): Detected primary emotion during the answer.

      - EvaluationResult:
          ▸ question (string): The interview question asked.
          ▸ audioBlob (Blob): Raw audio recording of the answer.
          ▸ transcript (string): Transcribed speech text.
          ▸ confidence (number): AI-evaluated confidence score.
          ▸ bodyLanguage (optional): Additional non-verbal data.

   Function:
      - saveEvaluation(evaluationData, userId): Promise<Response>
          ▸ Sends evaluation results to the backend as JSON.
          ▸ Returns the raw Fetch API response for further handling.

   Notes:
      - Ensure the backend route `/api/save-evaluation` is implemented to process and store the data.
      - AudioBlob is included in the object but should be omitted or converted before sending if not serializable.
      - Suitable for storing multi-modal interview results in candidate profiles.

------------------------------------------------------------------------------------*/

type BodyLanguageMetrics = {
    smilingScore: number;
    eyeContact: boolean;
    emotion: string;
  };
  
  type EvaluationResult = {
    question: string;
    audioBlob: Blob;
    transcript: string;
    confidence: number;
    bodyLanguage?: BodyLanguageMetrics;
  };
  
  export const saveEvaluation = async (evaluationData: EvaluationResult[], userId: string) => {
    return fetch('/api/save-evaluation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, evaluationData }),
    });
  };