// Author: Ehab Farhat - Alaa ElSet
// File: CourseService.ts
/*-- CourseService.ts ----------------------------------------------------------------

   This file defines the `CourseService` class, a business logic service for managing 
   course-related operations. It interacts with the `Course` Mongoose model to create, 
   retrieve, and fetch detailed course data.

   Features:
      - Allows creation of new course records with optional multimedia resources.
      - Retrieves all courses stored in the database.
      - Fetches individual course details by ID.

   Methods:
      - createCourse(title, description, price?, youtubeUrl?, bookLink?, content?)
          ▸ Creates a new course document with the provided details.
          ▸ Supports optional fields like video URL, book reference, and rich content.

      - getAllCourses()
          ▸ Returns an array of all available courses.

      - getCourseById(courseId)
          ▸ Retrieves a specific course by its MongoDB ObjectId.
          ▸ Returns null if no course is found.

   Notes:
      - Decorated with `@injectable()` for compatibility with InversifyJS DI container.
      - Uses the `Course` model defined in `models/Course.ts`.
      - Used by `CourseController` to serve API requests.

------------------------------------------------------------------------------------*/

import { injectable } from 'inversify';
import 'reflect-metadata';
import Course from '../models/Course';

@injectable()
export default class CourseService {
    // Update createCourse method to accept youtubeUrl, bookLink, and content
    async createCourse(title: string, description: string, price?: number, youtubeUrl?: string, bookLink?: string, content?: string) {
        return await Course.create({
            title,
            description,
            price,
            youtubeUrl,
            bookLink,   
            content  
        });
    }

    async getAllCourses() {
        return await Course.find();
    }

    async getCourseById(courseId: string) {
        return await Course.findById(courseId);
    }
}
