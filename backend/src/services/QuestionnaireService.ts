// Author: Ehab Farhat - Alaa ElSet
// File: QuestionnaireService.ts
/*-- QuestionnaireService.ts ---------------------------------------------------------

   This file defines the `QuestionnaireService` class, a business logic service for 
   managing quiz-style questions used in assessments and career path evaluation. 
   It interfaces with the `Questionnaire` Mongoose model to handle data operations.

   Features:
      - Retrieves quiz questions filtered by field or category.
      - Returns all available questions in the database.
      - Creates new multiple-choice questions with correct answers and metadata.

   Methods:
      - getQuestionsByField(field)
          ▸ Returns all questions that belong to a specific field (e.g., AI, Web Dev).

      - getAllQuestions()
          ▸ Fetches all questionnaire entries in the database.

      - createQuestion(question, options, correctAnswer, field)
          ▸ Creates a new question with answer choices and categorization.

   Notes:
      - Decorated with `@injectable()` for compatibility with InversifyJS DI.
      - Uses the `Questionnaire` model from `models/Questionnaire.ts`.
      - Used by the `QuestionnaireController` to support frontend quizzes and career tools.

------------------------------------------------------------------------------------*/

import { injectable } from 'inversify';
import 'reflect-metadata';
import Questionnaire from '../models/Questionnaire';

@injectable()
export default class QuestionnaireService {
    async getQuestionsByField(field: string) {
        return await Questionnaire.find({ field });
    }

    async getAllQuestions() {
        return await Questionnaire.find();
    }

    async createQuestion(question: string, options: string[], correctAnswer: string, field: string) {
        return await Questionnaire.create({ question, options, correctAnswer, field });
    }
}