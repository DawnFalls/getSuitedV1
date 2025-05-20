// Author: Ehab Farhat - Alaa ElSet
// File: InterviewController.ts (AI Evaluation)
/*-- InterviewController.ts ----------------------------------------------------------

   This file defines the AI-enhanced `InterviewController`, an Express controller 
   that integrates with the Groq API (LLama3-70b-8192 model) to generate and evaluate 
   technical interview questions and pseudocode responses.

   Features:
      - Generates interview questions using an AI prompt.
      - Evaluates candidate pseudocode answers for correctness and logic.
      - Parses AI output to extract structured feedback and scores.
      - Handles and logs errors gracefully, returning meaningful responses.

   Endpoints:
      - POST /api/interview/generate-questions
          ▸ Sends a prompt to the Groq API to generate interview questions.
          ▸ Request body: { prompt: string }
          ▸ Response: { questions: string[] }

      - POST /api/interview/evaluate
          ▸ Evaluates a pseudocode answer using the Groq AI API.
          ▸ Request body: { prompt: string }
          ▸ Response: { score: number, feedback: string }

   Notes:
      - Requires the `GROQ_API_KEY` environment variable to authenticate API requests.
      - Uses LLama3 70B model hosted on Groq for rapid and accurate responses.
      - Strips numbering from generated questions and extracts "Score" and "Feedback"
        using regex from AI output for consistency.

------------------------------------------------------------------------------------*/

import { controller, httpPost, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import axios from 'axios';

@controller('/api/interview')
export class InterviewController {
  @httpPost('/generate-questions')
  public async generateQuestions(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a professional technical recruiter.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 800,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const generatedText = response.data.choices[0]?.message?.content;

      if (!generatedText) {
        res.status(500).json({ error: 'No questions generated' });
        return;
      }

      const questions = generatedText
        .split('\n')
        .map((q: string) => q.replace(/^\d+\.\s*/, '')) 
        .filter((q: string) => q.trim() !== '');

      res.json({ questions });
    } catch (error: any) {
      console.error('Error generating interview questions:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to generate questions' });
    }
  }

  @httpPost('/evaluate')
  public async evaluatePseudocode(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a technical interviewer evaluating pseudocode for logic only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const output = response.data.choices[0]?.message?.content;
      console.log('🧠 Groq Evaluation Output:\n', output);

      if (!output) {
        res.status(500).json({ error: 'No evaluation returned' });
        return;
      }

      const scoreMatch = output.match(/Score:\s*(\d+)/i);
      const feedbackMatch = output.match(/Feedback:\s*(.*)/);

      res.json({
        score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
        feedback: feedbackMatch ? feedbackMatch[1].trim() : '',
      });
    } catch (error: any) {
      console.error('Error evaluating pseudocode:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to evaluate pseudocode' });
    }
  }
}
