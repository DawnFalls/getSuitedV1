// Author: Ehab Farhat - Alaa ElSet
// File: Interview.ts
/*-- Interview.ts --------------------------------------------------------------------

   This file defines the Mongoose schema and model for `Interview` documents, used to 
   store information about user interviews (technical or behavioral) in the database.

   Features:
      - Associates each interview with a specific user via ObjectId reference.
      - Supports categorizing interviews as either 'technical' or 'behavioral'.
      - Allows optional scoring and feedback for post-interview evaluation.
      - Automatically timestamps each interview upon creation.

   Schema Fields:
      - user (ObjectId, required): Reference to the associated user (User model).
      - type (string, required): Type of interview. Accepted values:
          ▸ "technical"
          ▸ "behavioral"
      - score (number, optional): Evaluation score given to the interview.
      - feedback (string, optional): Written feedback or assessment notes.
      - createdAt (Date, auto-generated): Timestamp of interview creation.

   Notes:
      - Exported model: `Interview`
      - Collection will be automatically named `interviews` by Mongoose.
      - Used in `InterviewService` and `InterviewController` to manage interview data.

------------------------------------------------------------------------------------*/

import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['technical', 'behavioral'], required: true },
    score: { type: Number, required: false },
    feedback: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const Interview = mongoose.model('Interview', InterviewSchema);
export default Interview;