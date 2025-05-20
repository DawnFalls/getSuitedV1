// Author: Ehab Farhat - Alaa ElSet
// File: interviewService.ts
/*-- interviewService.ts -------------------------------------------------------------

   This file provides client-side utility functions for generating and evaluating 
   interview questions using an AI-powered backend. It integrates with `/api/interview` 
   endpoints to support both behavioral and technical interview preparation.

   Features:
      - Generates custom behavioral and technical questions based on role details.
      - Evaluates pseudocode answers using a structured scoring format.
      - Interacts with AI endpoints hosted on the backend (e.g., Groq or OpenAI).

   Interfaces:
      - InterviewDetails:
          ▸ position: string
          ▸ workType: string
          ▸ seniority: string
          ▸ companyName: string
          ▸ workModel: string

   Functions:
      - fetchInterviewQuestions(details: InterviewDetails): Promise<string>
          ▸ Generates 5 role-specific interview questions evaluating soft and technical skills.
          ▸ Uses a detailed prompt and POSTs to `/api/interview/generate-questions`.

      - fetchTechnicalQuestions(details: InterviewDetails): Promise<string>
          ▸ Generates 5 pseudocode-style technical questions for coding assessment.
          ▸ Optimized for logical problem-solving evaluation.

      - evaluatePseudocode(question: string, answer: string): Promise<{ score: number, feedback: string }>
          ▸ Submits a pseudocode answer for AI-based evaluation.
          ▸ Expects a strict output format and parses score and feedback.

   Notes:
      - Backend endpoint `/api/interview/generate-questions` must accept a `prompt` in the POST body.
      - `evaluatePseudocode` relies on a consistent AI output structure to extract scoring.
      - Intended for use in interview simulations and AI coaching platforms.

------------------------------------------------------------------------------------*/

import axios from 'axios';

interface InterviewDetails {
  position: string;
  workType: string;
  seniority: string;
  companyName: string;
  workModel: string;
}

export const fetchInterviewQuestions = async (details: InterviewDetails) => {
  const prompt = `
You are an AI interview coach.

Generate exactly 5 interview questions only (no introduction, no headings, no question numbers, no labels like "Technical Skills" or "Soft Skills").

The candidate is applying for a ${details.workType} ${details.position} role at ${details.companyName}.
It is a ${details.seniority}-level, ${details.workModel} position.

Each question should be on a new line, and should evaluate both technical and soft skills.

Respond ONLY with the 5 questions as plain text.
`;

  const response = await axios.post('http://localhost:5001/api/interview/generate-questions', { prompt });
  return response.data;
};

export const fetchTechnicalQuestions = async (details: InterviewDetails) => {
  const prompt = `
You are a technical interviewer.

Generate exactly 5 interview questions specifically designed to be answered using pseudocode ONLY for a ${details.workType} ${details.position} role at ${details.companyName}.
It is a ${details.seniority}-level, ${details.workModel} position.

Each question should:
- Focus on algorithmic or logical challenges (like recursion, loops, conditionals, sorting, searching, etc.)
- Be phrased clearly to invite a pseudocode-style response
- Be short, concise, and on a single line (no numbering, no headings)

Respond ONLY with the 5 questions as plain text, each on a new line.
`;

  const response = await axios.post('http://localhost:5001/api/interview/generate-questions', { prompt });
  return response.data;
};

export const evaluatePseudocode = async (question: string, answer: string) => {
    const prompt = `
You are a technical interviewer. The candidate answered the following technical question using pseudocode.

Question:
${question}

Pseudocode Answer:
${answer}

Evaluate only the logical correctness of the answer (not syntax or formatting).

Return your response in this strict format:
Score: <a number between 0 and 100>
Feedback: <brief feedback>
`;
  
    const res = await axios.post('http://localhost:5001/api/interview/evaluate', { prompt });
    const text = (res.data?.text || res.data)?.trim?.() || '';
    const scoreMatch = text.match(/Score:\s*(\d+)/i);
    const feedbackMatch = text.match(/Feedback:\s*(.*)/);
  
    return {
      score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
      feedback: feedbackMatch ? feedbackMatch[1].trim() : '',
    };
  };