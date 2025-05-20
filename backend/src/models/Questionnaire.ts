// Author: Ehab Farhat - Alaa ElSet
// File: Questionnaire.ts
/*-- Questionnaire.ts ----------------------------------------------------------------

   This file defines the Mongoose schema and model for `Questionnaire` documents, 
   representing individual quiz questions categorized by field of study or expertise.

   Features:
      - Stores multiple-choice questions with their options and correct answer.
      - Classifies each question by a specific domain or topic field (e.g., AI, Web Dev).
      - Enforces required fields for question integrity and consistency.

   Schema Fields:
      - question (string, required): The quiz question text.
      - options (string[], required): List of answer choices.
      - correctAnswer (string, required): The correct answer from the options array.
      - field (string, required): The domain/topic the question belongs to.

   Notes:
      - Exported model: `Questionnaire`
      - Collection will be automatically named `questionnaires` by Mongoose.
      - Used in `QuestionnaireService` and `QuestionnaireController` to support quizzes,
        assessments, and career path recommendations.

------------------------------------------------------------------------------------*/

import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    field: { type: String, required: true },
});

const Questionnaire = mongoose.model('Questionnaire', QuestionSchema);
export default Questionnaire;