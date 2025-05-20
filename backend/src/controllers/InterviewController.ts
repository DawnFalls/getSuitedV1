// Author: Ehab Farhat - Alaa ElSet
// File: InterviewController.ts
/*-- InterviewController.ts ----------------------------------------------------------

   This file defines the `InterviewController`, an Express controller responsible for 
   managing interview-related operations such as creating interviews, fetching 
   interviews by user ID, and retrieving all interview records.

   Features:
      - Creates a new interview record for a user (protected by JWT).
      - Retrieves all interviews associated with a specific user.
      - Returns all interviews stored in the system for administrative or reporting use.

   Endpoints:
      - POST /interviews/
          ▸ Creates a new interview (requires JWT authentication).
          ▸ Request body: {
              user: string,
              type: string,
              score: number,
              feedback: string
            }
          ▸ Response: Interview object

      - GET /interviews/:userId
          ▸ Fetches all interviews linked to the specified user ID.
          ▸ Path param: userId (string)
          ▸ Response: Array of interview objects

      - GET /interviews/
          ▸ Returns all interview records.
          ▸ Response: Array of interview objects

   Notes:
      - Uses `InterviewService` to handle business logic.
      - Applies `authenticateJWT` middleware to protect interview creation.
      - Error handling ensures stable API responses and proper feedback to clients.

------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { controller, httpPost, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import InterviewService from '../services/InterviewService';
import { authenticateJWT } from '../middleware/AuthMiddleware';

@controller('/interviews')
export default class InterviewController {
    constructor(@inject(TYPES.InterviewService) private interviewService: InterviewService) {}

    @httpPost('/', authenticateJWT)
    public async createInterview(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { user, type, score, feedback } = req.body;
            const interview = await this.interviewService.createInterview(user, type, score, feedback);
            res.status(201).json(interview);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/:userId')
    public async getInterviewsByUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const interviews = await this.interviewService.getInterviewsByUser(req.params.userId);
            res.json(interviews);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/')
    public async getAllInterviews(@response() res: Response): Promise<void> {
        try {
            const interviews = await this.interviewService.getAllInterviews();
            res.json(interviews);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}