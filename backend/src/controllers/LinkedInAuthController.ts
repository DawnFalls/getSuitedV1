// Author: Ehab Farhat - Alaa ElSet
// File: LinkedInAuthController.ts
/*-- LinkedInAuthController.ts -------------------------------------------------------

   This file defines the `LinkedInAuthController`, an Express controller that manages 
   LinkedIn OAuth 2.0 authentication using Passport.js. It facilitates login via 
   LinkedIn and issues a JWT token to authenticated users for frontend use.

   Features:
      - Initiates LinkedIn OAuth flow using Passport's LinkedIn strategy.
      - Handles LinkedIn OAuth callback and extracts authenticated user data.
      - Signs a JWT containing the user's ID, name, email, and profile picture.
      - Redirects the authenticated user to the frontend with a token.

   Endpoints:
      - GET /auth/linkedin
          ▸ Starts the LinkedIn login flow via Passport middleware.
          ▸ Redirects user to LinkedIn's OAuth consent screen.

      - GET /auth/linkedin/callback
          ▸ Handles the OAuth callback from LinkedIn.
          ▸ On success, issues JWT and redirects to:
              `${FRONTEND_URL}/oauth-success?token=<jwt>`
          ▸ On failure, redirects to `/login`.

   Notes:
      - Requires a configured LinkedIn strategy in Passport (`passport.use(...)`).
      - The JWT is signed with the `JWT_SECRET` from environment variables.
      - Relies on `FRONTEND_URL` environment variable for redirecting to the client.

------------------------------------------------------------------------------------*/

import { controller, httpGet } from 'inversify-express-utils';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

@controller('/auth')
export class LinkedInAuthController {
  @httpGet('/linkedin', passport.authenticate('linkedin'))
  public startOAuth(): void {
    // Handled by passport middleware
  }

  @httpGet('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }))
  public linkedInCallback(req: Request, res: Response): void {
    const user = req.user as any;
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '2h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
}