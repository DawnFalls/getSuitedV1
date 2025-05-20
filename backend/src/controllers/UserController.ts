// Author: Ehab Farhat - Alaa ElSet
// File: UserController.ts
/*-- UserController.ts ---------------------------------------------------------------

   This file defines the `UserController`, an Express controller responsible for 
   handling all user-related operations, including registration, profile management, 
   score updates, evaluation uploads, and profile picture handling with AWS S3.

   Features:
      - Registers new users and retrieves user data by ID or email.
      - Supports uploading evaluation PDFs and profile pictures.
      - Allows updating user attributes such as score and name.
      - Integrates JWT authentication and file uploads via multer/multer-s3.

   Endpoints:
      - POST /users/register
          ▸ Registers a new user.
          ▸ Request body: { name, email, password, ... }
          ▸ Response: Confirmation and user info

      - GET /users/
          ▸ Retrieves all users in the system.
          ▸ Response: Array of user objects

      - GET /users/evaluations?email=...
          ▸ Retrieves evaluations for a user identified by email.
          ▸ Response: Array of evaluation file metadata

      - GET /users/:id
          ▸ Fetches a user by their unique ID.
          ▸ Response: User object

      - POST /users/upload-evaluation
          ▸ Uploads an evaluation PDF to AWS S3 and links it to a user.
          ▸ Requires: multipart/form-data with `file`, and either `email` or `name`
          ▸ Protected by: JWT
          ▸ Response: Upload confirmation and updated user data

      - PATCH /users/:id/score
          ▸ Updates the user's score.
          ▸ Request body: { score: number }
          ▸ Protected by: JWT
          ▸ Response: Updated user object

      - PATCH /users/:id/name
          ▸ Updates the user's name.
          ▸ Request body: { name: string }
          ▸ Protected by: JWT
          ▸ Response: Confirmation and updated user

      - PATCH /users/:id/profilePicture
          ▸ Uploads a new profile picture to AWS S3.
          ▸ Requires: multipart/form-data with `profilePicture`
          ▸ Protected by: JWT
          ▸ Response: Confirmation and updated user

   Notes:
      - Uses `uploadMiddleware` (multer-s3) for file handling.
      - Business logic handled by `UserService`.
      - JWT middleware (`authenticateJWT`) protects modification routes.
      - Designed for extensibility with clear separation of concerns.

------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import {
  controller, httpPost, httpGet, httpPatch, request, response,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import UserService from '../services/UserService';
import { authenticateJWT } from '../middleware/AuthMiddleware';
import upload from '../middleware/uploadMiddleware';

@controller('/users')
export default class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
  ) {}

  /* ----------  Create ---------- */
  @httpPost('/register')
  async createUser(@request() req: Request, @response() res: Response) {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json({
        message: 'User created',
        user: { id: newUser._id, name: newUser.name },
      });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  /* ----------  Read ---------- */
  @httpGet('/')
  async getAll(@response() res: Response) {
    res.json(await this.userService.getAllUsers());
  }

  @httpGet('/evaluations')
async getEvaluationsByEmail(@request() req: Request, @response() res: Response) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await this.userService.getUserByEmail(email as string);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user.evaluations);
}

  @httpPost('/upload-evaluation', authenticateJWT, upload.single('file'))
async uploadEvaluation(@request() req: Request, @response() res: Response) {
  try {
    const { email, name } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    if (!email && !name) return res.status(400).json({ error: 'Email or name required' });

    const fileUrl = (file as any).location;
    const fileName = file.originalname;

    const user = await this.userService.addEvaluationByIdentifier({ email, name }, fileName, fileUrl);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Evaluation uploaded successfully', user });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
}

  @httpGet('/:id')
  async getById(@request() req: Request, @response() res: Response) {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }

  /* ----------  Update score ---------- */
  @httpPatch('/:id/score', authenticateJWT)
  async updateScore(@request() req: Request, @response() res: Response) {
    const { score } = req.body;
    const user = await this.userService.updateUserScore(req.params.id, score);
    res.json(user);
  }

  /* ----------  Update name ---------- */
  @httpPatch('/:id/name', authenticateJWT)
  async updateName(@request() req: Request, @response() res: Response) {
    const { name } = req.body;
    const user = await this.userService.updateUserName(req.params.id, name);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Name updated', user });
  }

 /* ----------  Update profile pic (AWS S3) ---------- */
@httpPatch('/:id/profilePicture', authenticateJWT, upload.single('profilePicture'))
async updatePic(@request() req: Request, @response() res: Response) {
  try {
    if (!req.file) {
      console.warn('⚠️ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = (req.file as any).location; // AWS S3 public URL provided by multer-s3

    const user = await this.userService.updateProfilePicture(req.params.id, imageUrl);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ message: 'Picture updated successfully', user });
  } catch (err: any) {
    console.error('❌ Upload error:', err);
    return res.status(500).json({ error: err.message });
  }
}

}