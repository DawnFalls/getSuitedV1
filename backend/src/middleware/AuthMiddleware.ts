// Author: Ehab Farhat - Alaa ElSet
// File: AuthMiddleware.ts
/*-- AuthMiddleware.ts ---------------------------------------------------------------

   This file defines the `authenticateJWT` middleware function used to protect routes 
   in the Express application by validating JSON Web Tokens (JWT). It ensures that 
   only authenticated users can access specific endpoints.

   Features:
      - Extracts JWT token from the Authorization header using Bearer schema.
      - Verifies token validity and signature using the `JWT_SECRET` from environment variables.
      - Attaches decoded user payload to the request object for downstream use.
      - Sends appropriate 401 or 403 errors for missing or invalid tokens.

   Usage:
      - Applied as middleware to any protected route (e.g., POST, PATCH).
      - Signature: `authenticateJWT(req, res, next)`

   Request Requirements:
      - Header: Authorization: Bearer <token>

   Notes:
      - Requires `dotenv` to load `process.env.JWT_SECRET`.
      - Assumes token is signed using HMAC SHA (e.g., HS256).
      - Decoded token is attached to `req.user` for use in controllers/services.

------------------------------------------------------------------------------------*/

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next(); // ✅ proceed
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
}