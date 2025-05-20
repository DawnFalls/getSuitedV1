// Author: Ehab Farhat - Alaa ElSet
// File: QuestionnaireController.ts
/*-- QuestionnaireController.ts ------------------------------------------------------

   This file defines the `QuestionnaireController`, an Express controller responsible 
   for managing quiz-style questionnaire operations. It provides endpoints to create 
   and retrieve questions by field or in full, using InversifyJS for dependency injection.

   Features:
      - Creates a new quiz question with field classification (JWT protected).
      - Retrieves all questions available in the database.
      - Filters and returns questions based on a specific field (e.g., AI, Web Dev, etc.).
      - Logs key information for debugging purposes.

   Endpoints:
      - POST /questionnaire/
          ▸ Creates a new questionnaire entry (requires JWT).
          ▸ Request body: {
              question: string,
              options: string[],
              correctAnswer: string,
              field: string
            }
          ▸ Response: Created question object

      - GET /questionnaire/
          ▸ Retrieves all questionnaire questions.
          ▸ Response: Array of all question objects

      - GET /questionnaire/:field
          ▸ Retrieves questions filtered by a specific field.
          ▸ Path param: field (string)
          ▸ Response: Array of question objects for that field

   Notes:
      - Business logic handled by `QuestionnaireService`.
      - `authenticateJWT` middleware protects the question creation route.
      - Logs are printed to the console for development debugging and should be removed or replaced with a logger in production.

------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { controller, httpPost, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import QuestionnaireService from '../services/QuestionnaireService';
import { authenticateJWT } from '../middleware/AuthMiddleware';

@controller('/questionnaire')
export default class QuestionnaireController {
    constructor(@inject(TYPES.QuestionnaireService) private questionnaireService: QuestionnaireService) {}

    @httpGet('/:field')
public async getQuestionsByField(@request() req: Request, @response() res: Response): Promise<void> {
    try {
        const { field } = req.params;
        console.log("Requested field:", field); 
        const questions = await this.questionnaireService.getQuestionsByField(field);
        console.log("Fetched questions:", questions); 
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}


    @httpGet('/')
    public async getAllQuestions(@response() res: Response): Promise<void> {
        try {
            const questions = await this.questionnaireService.getAllQuestions();
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpPost('/', authenticateJWT)
    public async createQuestion(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { question, options, correctAnswer, field } = req.body;
            const newQuestion = await this.questionnaireService.createQuestion(question, options, correctAnswer, field);
            res.status(201).json(newQuestion);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}