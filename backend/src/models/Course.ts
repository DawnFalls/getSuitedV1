// Author: Ehab Farhat - Alaa ElSet
// File: Course.ts
/*-- Course.ts -----------------------------------------------------------------------

   This file defines the Mongoose schema and model for `Course` documents in the 
   MongoDB database. A course can represent a learning resource with optional pricing 
   and media content.

   Features:
      - Defines schema fields such as title, description, price, and media links.
      - Includes optional support for YouTube videos, book links, and course content.
      - Automatically timestamps course creation using `createdAt`.

   Schema Fields:
      - title (string, required): Name of the course.
      - description (string, required): Brief overview of the course.
      - price (number, optional): Cost of the course, if applicable.
      - youtubeUrl (string, optional): Link to a related YouTube video.
      - bookLink (string, optional): Link to a recommended book resource.
      - content (string, optional): Detailed course content or outline.
      - createdAt (Date, auto-generated): Timestamp of course creation.

   Notes:
      - Exported model: `Course`
      - Collection will be automatically named `courses` by Mongoose (pluralized).
      - Used by `CourseService` and `CourseController` for course-related operations.

------------------------------------------------------------------------------------*/

import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false }, 
    youtubeUrl: { type: String, required: false },  
    bookLink: { type: String, required: false },  
    content: { type: String, required: false },   
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;
