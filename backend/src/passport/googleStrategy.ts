// Author: Ehab Farhat - Alaa ElSet
// File: googleStrategy.ts
/*-- googleStrategy.ts ---------------------------------------------------------------

   This file configures the Google OAuth 2.0 strategy for Passport.js, allowing users 
   to authenticate using their Google accounts. It handles user lookup and creation 
   in the MongoDB database using the `User` model.

   Features:
      - Initializes Passport with Google OAuth credentials from environment variables.
      - Retrieves user's name, email, and profile picture from their Google profile.
      - Automatically creates a new user in the database if one doesn't already exist.
      - Supports session-based serialization and deserialization.

   OAuth Strategy:
      - Strategy: Google OAuth 2.0
      - Callback URL: /auth/google/callback
      - Scopes: ['profile', 'email']

   Environment Variables Required:
      - GOOGLE_CLIENT_ID
      - GOOGLE_CLIENT_SECRET

   Notes:
      - `passport.serializeUser` and `passport.deserializeUser` are configured for 
        session management (though sessions are optional with JWT-based flows).
      - Assumes a default password of 'google-auth' for users created via OAuth.
      - Model used: `User` from `../models/User`

------------------------------------------------------------------------------------*/

import passport from 'passport';
import { Strategy as GoogleStrategy, StrategyOptions } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User'; // Adjust path as needed

dotenv.config();

const options: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback',
};

passport.use(new GoogleStrategy(options, async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const email = profile.emails?.[0].value;
    const name = profile.displayName;
    const profilePicture = profile.photos?.[0].value;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: 'google-auth',
        profilePicture,
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
