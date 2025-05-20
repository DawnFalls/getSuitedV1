// Author: Ehab Farhat - Alaa ElSet
// File: AuthService.ts
/*-- AuthService.ts ------------------------------------------------------------------

   This file defines the `AuthService` class, a business logic service responsible for 
   handling authentication-related operations including user registration, login, and 
   JWT verification. It uses bcrypt for password hashing and JWT for token-based auth.

   Features:
      - Registers new users after ensuring email uniqueness.
      - Hashes passwords securely using bcrypt before saving to the database.
      - Authenticates users via email and password with JWT token generation.
      - Verifies JWT tokens and returns decoded payloads for authorization purposes.

   Methods:
      - register(name, email, password, profilePicture?)
          ▸ Checks for existing user by email.
          ▸ Hashes password and saves new user.
          ▸ Returns a JWT and user object (password excluded).

      - login(email, password)
          ▸ Verifies user credentials and password hash.
          ▸ Returns a JWT and user object (password excluded).

      - verifyToken(token)
          ▸ Validates and decodes a JWT using the app's secret key.
          ▸ Throws error on invalid or expired tokens.

   Environment Variables Required:
      - JWT_SECRET
      - JWT_EXPIRES_IN

   Notes:
      - Decorated with `@injectable()` for use with InversifyJS DI container.
      - Works in coordination with the `AuthController` and `User` Mongoose model.
      - Password field is omitted before returning the user object to the client.

------------------------------------------------------------------------------------*/

import { injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { UserDocument } from '../models/User';

dotenv.config();

@injectable()
class AuthService {
    async register(name: string, email: string, password: string, profilePicture?: string): Promise<{ user: Partial<UserDocument>, token: string}> {
        const existing = await User.findOne({ email });
        if (existing) throw new Error('Email already in use');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, profilePicture });
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
          );
        await user.save();
        const { password: _, ...safeUser } = user.toObject();
        return { user: safeUser, token };
    }

    async login(email: string, password: string): Promise<{ user: Partial<UserDocument>, token: string }> {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        if (!user.password) throw new Error('User password is missing');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
          );

        // sanitize password
        const { password: _, ...safeUser } = user.toObject();
        return { user: safeUser, token };
    }

    async verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            return decoded;
        } catch (err) {
            throw new Error('Invalid or expired token');
        }
    }
}

export default AuthService;