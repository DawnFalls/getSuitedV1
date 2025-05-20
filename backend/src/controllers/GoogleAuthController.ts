// Author: Ehab Farhat - Alaa ElSet
// File: GoogleAuthController.ts
/*-- GoogleAuthController.ts ---------------------------------------------------------

   This file defines the `GoogleAuthController`, an Express controller that manages 
   Google OAuth 2.0 authentication flow using Passport.js. It handles redirecting users 
   to Google's consent screen and processing the OAuth callback to issue a JWT token 
   for frontend use.

   Features:
      - Initiates Google OAuth login using Passport strategy.
      - Handles Google callback, extracts user data, and generates a JWT.
      - Redirects users back to the frontend with an access token in the query string.

   Endpoints:
      - GET /auth/google
          ▸ Initiates the Google OAuth login flow.
          ▸ Redirects to Google’s authentication page (scopes: profile, email).

      - GET /auth/google/callback
          ▸ Handles the callback from Google after authentication.
          ▸ On success, signs a JWT with user details and redirects to:
              `${FRONTEND_URL}/oauth-success?token=<jwt>`
          ▸ On failure, redirects to `/login`.

   Notes:
      - Requires a configured Google strategy in Passport (`passport.use(...)`).
      - The JWT secret is pulled from `process.env.JWT_SECRET`.
      - Relies on `FRONTEND_URL` environment variable for redirection.

------------------------------------------------------------------------------------*/

import { controller, httpGet } from 'inversify-express-utils';
import passport from 'passport';
import express from 'express';
import jwt from 'jsonwebtoken';

@controller('/auth')
export class GoogleAuthController {
  @httpGet('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
  public initiateOAuth(): void {}

  @httpGet('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }))
  public handleCallback(req: express.Request, res: express.Response): void {
    const user = req.user as any;
    const token = jwt.sign({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
}