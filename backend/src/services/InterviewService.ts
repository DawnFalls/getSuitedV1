// Author: Ehab Farhat - Alaa ElSet
// File: InterviewService.ts
/*-- InterviewService.ts -------------------------------------------------------------

   This file defines the `InterviewService` class, a business logic service for managing 
   interview records. It interacts with the `Interview` Mongoose model to create and 
   retrieve interview data for both users and administrators.

   Features:
      - Creates interview entries for users, including type, score, and feedback.
      - Retrieves all interviews associated with a specific user.
      - Provides access to all interview records stored in the system.

   Methods:
      - createInterview(user, type, score?, feedback?)
          ▸ Creates a new interview record with the provided data.
          ▸ Type must be either "technical" or "behavioral".

      - getInterviewsByUser(userId)
          ▸ Returns all interviews linked to a specific user by their ID.

      - getAllInterviews()
          ▸ Fetches all interview records from the database (admin-level access).

   Notes:
      - Decorated with `@injectable()` for use with InversifyJS DI container.
      - Uses the `Interview` Mongoose model defined in `models/Interview.ts`.
      - Supports optional scoring and textual feedback for each interview.

------------------------------------------------------------------------------------*/

import { injectable } from 'inversify';
import 'reflect-metadata';
import Interview from '../models/Interview';

@injectable()
export default class InterviewService {
    async createInterview(user: string, type: 'technical' | 'behavioral', score?: number, feedback?: string) {
        return await Interview.create({ user, type, score, feedback });
    }

    async getInterviewsByUser(userId: string) {
        return await Interview.find({ user: userId });
    }

    async getAllInterviews() {
        return await Interview.find();
    }
}