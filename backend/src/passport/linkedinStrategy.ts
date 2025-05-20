// Author: Ehab Farhat - Alaa ElSet
// File: linkedinStrategy.ts
/*-- linkedinStrategy.ts -------------------------------------------------------------

   This file configures the LinkedIn OAuth 2.0 strategy for Passport.js, enabling 
   users to log in using their LinkedIn credentials. It retrieves the user's profile 
   and email information for authentication and application use.

   Features:
      - Initializes Passport with LinkedIn credentials loaded from environment variables.
      - Requests user's basic profile and email using the appropriate OAuth scopes.
      - Constructs a simplified user object with ID, name, email, and profile picture.
      - Supports Passport's serialize and deserialize methods for session persistence.

   OAuth Strategy:
      - Strategy: LinkedIn OAuth 2.0
      - Callback URL: /auth/linkedin/callback
      - Scopes: ['r_liteprofile', 'r_emailaddress']

   Environment Variables Required:
      - LINKEDIN_CLIENT_ID
      - LINKEDIN_CLIENT_SECRET

   Notes:
      - Returned `user` object is a simplified representation; no DB persistence by default.
      - This strategy is compatible with both session and token-based flows.
      - Can be extended to store or sync LinkedIn-authenticated users in your database.

------------------------------------------------------------------------------------*/

import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID || '',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
  callbackURL: '/auth/linkedin/callback',
  scope: ['r_liteprofile', 'r_emailaddress'],
}, async (_accessToken, _refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0].value,
    profilePicture: profile.photos?.[0]?.value,
  };

  return done(null, user);
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});