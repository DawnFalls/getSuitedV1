// Author: Ehab Farhat - Alaa ElSet
// File: UserService.ts
/*-- UserService.ts ------------------------------------------------------------------

   This file defines the `UserService` class, which encapsulates all user-related 
   business logic for the platform. It handles user creation, profile updates, 
   evaluation uploads, and various queries using the `User` Mongoose model.

   Features:
      - Creates users with hashed passwords for secure registration.
      - Supports user lookup by ID, email, or name.
      - Updates user attributes like name, score, and profile picture.
      - Handles evaluation uploads linked to a specific user.
      - Exposes utility methods for controllers to interact with the user model cleanly.

   Methods:
      - createUser(data)
          ▸ Hashes password and creates a new user document.

      - getAllUsers()
          ▸ Retrieves all users in the database.

      - getUserById(id)
          ▸ Returns a user by their ObjectId.

      - getUserByEmail(email)
          ▸ Retrieves a user's evaluation history by email (used in evaluation lookup).

      - updateUserScore(id, score)
          ▸ Updates the user’s score value.

      - updateUserName(id, name)
          ▸ Updates the user’s name.

      - updateProfilePicture(id, url)
          ▸ Replaces the user's profile picture with a new S3-hosted image.

      - addEvaluationByIdentifier({ email?, name? }, fileName, fileUrl)
          ▸ Locates a user by email or name and appends an evaluation PDF to their profile.

   Notes:
      - Decorated with `@injectable()` for InversifyJS integration.
      - Uses bcrypt with 10 salt rounds for secure password hashing.
      - Evaluation files are assumed to be uploaded and stored separately (e.g., AWS S3).

------------------------------------------------------------------------------------*/

import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import User, { UserDocument } from '../models/User';

@injectable()
export default class UserService {
  private readonly saltRounds = 10;

  /* ----------  Create ---------- */
  async createUser(data: { name: string; email: string; password: string; profilePicture?: string; }): Promise<UserDocument> {
    const hashed = await bcrypt.hash(data.password, this.saltRounds);
    return User.create({ ...data, password: hashed });
  }

  /* ----------  Read ---------- */
  getAllUsers() { 
    return User.find(); 
  }

  getUserById(id: string) { 
    return User.findById(id); 
  }

  /* ----------  Update ---------- */
  updateUserScore(id: string, score: number) {
    return User.findByIdAndUpdate(id, { score }, { new: true });
  }

  updateUserName(id: string, name: string) {
    return User.findByIdAndUpdate(id, { name }, { new: true });
  }

  async updateProfilePicture(id: string, url: string) {
    const user = await User.findByIdAndUpdate(id, { profilePicture: url }, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  getUserByEmail(email: string) {
  return User.findOne({ email }).select('evaluations');
}

  async addEvaluationByIdentifier(
  identifier: { email?: string; name?: string },
  fileName: string,
  fileUrl: string
) {
  const user = await User.findOne({
    ...(identifier.email ? { email: identifier.email } : {}),
    ...(identifier.name && !identifier.email ? { name: identifier.name } : {}),
  });

  if (!user) throw new Error('User not found');

  user.evaluations.push({ fileName, fileUrl });
  await user.save();

  return user;
}
}
