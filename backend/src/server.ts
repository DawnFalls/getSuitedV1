// Author: Ehab Farhat - Alaa ElSet
// File: server.ts
/*-- server.ts -----------------------------------------------------------------------

   This is the main entry point of the backend application. It initializes the Express 
   server with InversifyJS for dependency injection, registers controllers, applies 
   middleware (CORS, body parsing, sessions, Passport), and starts the API server.

   Features:
      - Connects to MongoDB via `connectDB()` before serving requests.
      - Initializes Inversify Express Server using DI container.
      - Registers Passport strategies for Google and LinkedIn OAuth.
      - Auto-registers all controller classes.
      - Enables CORS with cookie support for frontend communication.
      - Configures JSON and URL-encoded body parsers.
      - Sets up session middleware and initializes Passport for authentication.
      - Serves static files (e.g., uploaded PDFs) via `/uploads`.

   Middleware:
      - CORS: Accepts requests from `http://localhost:3000` with credentials.
      - Body Parsers: `express.json()`, `express.urlencoded({ extended: true })`
      - Sessions: `express-session` (in-memory; use Redis/Mongo for production)
      - Passport: OAuth 2.0 strategy initialization (Google, LinkedIn)

   Static File Mapping:
      - Serves files from `../../uploads` directory under the `/uploads` route.

   Server:
      - Port: `process.env.PORT` or defaults to `5001`
      - Launches and logs API availability on successful startup.

   Notes:
      - All controllers and passport strategies must be imported for auto-registration.
      - Be sure to update CORS origin and session settings before deploying to production.
      - This setup supports both token-based and session-based authentication flows.

------------------------------------------------------------------------------------*/

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/database';
import container from './config/inversify.config';
import { InversifyExpressServer } from 'inversify-express-utils';
import session from 'express-session';
import passport from 'passport';
import './passport/googleStrategy'; // register passport strategy
import './passport/linkedinStrategy';

// auto‑register controllers
import './controllers/AuthController';
import './controllers/UserController';
import './controllers/CourseController';
//import './controllers/InterviewController';
import './controllers/QuestionnaireController';
import './controllers/GoogleAuthController';
import './controllers/LinkedInAuthController';
import './controllers/InterviewControllerAPI';
import './controllers/TrainingController'
import './controllers/emailController';

dotenv.config();
connectDB();

const server = new InversifyExpressServer(container);

server.setConfig(app => {
  /* ---------- CORS ---------- */
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,                                 // allow cookies / auth‑headers
      methods: 'GET,POST,PATCH,PUT,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    }),
  );

  /* ---------- Body parsers ---------- */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  /* ---------- Static uploads ---------- */
  //  …/backend/uploads/  →  http://localhost:5001/uploads/<file>
  // in server.ts
  app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

});

const app  = server.build();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀  API ready on port ${PORT}`));
