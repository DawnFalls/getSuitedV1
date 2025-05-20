// Author: Ehab Farhat - Alaa ElSet
// File: User.ts
/*-- User.ts -------------------------------------------------------------------------

   This file defines the Mongoose schema and model for `User` documents, representing 
   platform users along with their profile data, scores, and uploaded evaluation files.

   Features:
      - Stores user information including name, email, optional password, and profile picture.
      - Maintains a numeric score used for performance tracking or gamification.
      - Embeds an array of uploaded evaluations with filename, URL, and timestamp.
      - Enforces email uniqueness to prevent duplicate accounts.

   Schema Fields:
      - name (string, required): Full name of the user.
      - email (string, required, unique): Email address used for login and identification.
      - password (string, optional): User password (can be omitted for OAuth accounts).
      - profilePicture (string, optional): URL of the user's profile image.
      - score (number, default = 0): Cumulative user score.
      - createdAt (Date, auto-generated): Timestamp of account creation.
      - evaluations (array of objects):
          ▸ fileName (string): Name of uploaded file.
          ▸ fileUrl (string): Public or S3 URL to access the file.
          ▸ createdAt (Date): Upload timestamp.

   Notes:
      - Exported model: `User`
      - Collection will be automatically named `users` by Mongoose.
      - Used across the platform for authentication, dashboard views, and user insights.

------------------------------------------------------------------------------------*/

import mongoose, { Schema, Document } from 'mongoose';

export interface Evaluation {
  fileName: string;
  fileUrl: string;
  createdAt?: Date;
}


export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
  score: number;
  createdAt?: Date;
  evaluations: Evaluation[];
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Changed from required: true
  profilePicture: { type: String, default: 'default.jpg' },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  evaluations: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
});

export default mongoose.model<UserDocument>('User', UserSchema);
