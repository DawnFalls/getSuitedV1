// Author: Ehab Farhat - Alaa ElSet
// File: CourseController.ts
/*-- CourseController.ts -------------------------------------------------------------

   This file defines the `CourseController`, an Express controller class responsible 
   for handling HTTP requests related to course creation and retrieval. It uses 
   InversifyJS for dependency injection and integrates middleware for authentication.

   Features:
      - Allows authenticated users to create new courses.
      - Provides public access to retrieve all courses or a specific course by ID.
      - Utilizes JWT authentication middleware for protected endpoints.
      - Uses structured JSON responses with proper error handling and status codes.

   Endpoints:
      - POST /courses/add
          ▸ Creates a new course (requires JWT authentication).
          ▸ Request body: {
              title: string,
              description: string,
              price?: number,
              youtubeUrl?: string,
              bookLink?: string,
              content?: string
            }
          ▸ Response: Created course object

      - GET /courses/
          ▸ Fetches all available courses.
          ▸ Response: Array of course objects

      - GET /courses/:id
          ▸ Retrieves a course by its unique identifier.
          ▸ Path param: id (string)
          ▸ Response: Course object or 404 if not found

   Notes:
      - The controller depends on `CourseService` for business logic.
      - The `authenticateJWT` middleware protects the course creation endpoint.
      - Requires consistent data validation and security checks in `CourseService`.

------------------------------------------------------------------------------------*/

import { Request, Response } from 'express';
import { controller, httpPost, httpGet, requestParam, requestBody, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import CourseService from '../services/CourseService';
import { authenticateJWT } from '../middleware/AuthMiddleware';

@controller('/courses')
export default class CourseController {
    constructor(@inject(TYPES.CourseService) private courseService: CourseService) {}

    @httpPost('/add', authenticateJWT)
    public async createCourse(
        @requestBody() body: {
            title: string;
            description: string;
            price?: number;
            youtubeUrl?: string;
            bookLink?: string;
            content?: string;
        },
        @response() res: Response
    ): Promise<void> {
        try {
            const course = await this.courseService.createCourse(
                body.title,
                body.description,
                body.price,
                body.youtubeUrl,
                body.bookLink,
                body.content
            );
            res.status(201).json(course); 
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/')
    public async getAllCourses(@response() res: Response): Promise<void> {
        try {
            const courses = await this.courseService.getAllCourses();
            res.json(courses); 
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/:id')
    public async getCourseById(
        @requestParam('id') id: string,
        @response() res: Response
    ): Promise<void> {
        try {
            const course = await this.courseService.getCourseById(id);
            if (!course) {
                res.status(404).json({ error: 'Course not found' });
                return;
            }
            res.json(course); 
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
