// Author: Ehab Farhat - Alaa ElSet
// File: types.ts
/*-- types.ts ------------------------------------------------------------------------

   This file defines a collection of unique symbolic identifiers used for dependency 
   injection with the InversifyJS container. These symbols are used to bind and 
   retrieve service instances in a type-safe and consistent manner.

   Features:
      - Declares globally unique symbols using `Symbol.for()` for each service.
      - Prevents naming collisions and ensures consistent DI bindings across the app.
      - Serves as a central registry for service identifiers.

   Symbols Defined:
      - UserService
      - CourseService
      - InterviewService
      - QuestionnaireService
      - AuthService
      - EmailService

   Notes:
      - Used in `inversify.config.ts` to bind services to the container.
      - Each corresponding service must be decorated with `@injectable()` for DI to work.

------------------------------------------------------------------------------------*/

const TYPES = {
    UserService: Symbol.for('UserService'),
    CourseService: Symbol.for('CourseService'),
    InterviewService: Symbol.for('InterviewService'),
    QuestionnaireService: Symbol.for('QuestionnaireService'),
    AuthService: Symbol.for('AuthService'),
    EmailService: Symbol.for('EmailService'), 
};

export default TYPES;