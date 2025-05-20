// Author: Ehab Farhat - Alaa ElSet
// File: inversify.config.ts
/*-- inversify.config.ts -------------------------------------------------------------

   This file configures the Dependency Injection (DI) container using the `inversify` 
   library, allowing for decoupled and testable service management throughout the 
   application.

   Features:
      - Initializes a DI `Container` instance.
      - Binds core service classes to their respective symbolic `TYPES`.
      - Supports constructor injection for services across the backend.
      - Promotes scalability and maintainability via loosely coupled dependencies.

   Services Bound:
      - UserService
      - CourseService
      - InterviewService
      - QuestionnaireService
      - AuthService
      - EmailService

   Notes:
      - Requires a `types.ts` file exporting unique identifiers for services.
      - Ensure that each bound service class is decorated with `@injectable()`.

------------------------------------------------------------------------------------*/

import { Container } from 'inversify';
import TYPES from './types'; 

// Import services
import UserService from '../services/UserService';
import CourseService from '../services/CourseService';
import InterviewService from '../services/InterviewService';
import QuestionnaireService from '../services/QuestionnaireService';
import AuthService from '../services/AuthService';
import EmailService from '../services/emailService';  

// DI container
const container = new Container();

// Bind services to the container
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<CourseService>(TYPES.CourseService).to(CourseService);
container.bind<InterviewService>(TYPES.InterviewService).to(InterviewService);
container.bind<QuestionnaireService>(TYPES.QuestionnaireService).to(QuestionnaireService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<EmailService>(TYPES.EmailService).to(EmailService); 

export default container;