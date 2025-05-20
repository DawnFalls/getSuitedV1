// Author: Ehab Farhat - Alaa ElSet
// File: connectDB.ts
/*-- connectDB.ts --------------------------------------------------------------------

   This file defines the `connectDB` function, which establishes a connection to the 
   MongoDB database using the Mongoose library.

   Features:
      - Loads environment variables from a `.env` file using `dotenv`.
      - Connects to the MongoDB database via `mongoose.connect`.
      - Enables use of the `useNewUrlParser` and `useUnifiedTopology` options to ensure 
        compatibility and stability with the latest MongoDB drivers.
      - Provides success and error logging for the database connection process.
      - Terminates the process gracefully if the connection fails.

   Notes:
      - Requires a valid MongoDB URI to be set in the environment variable `MONGO_URI`.
      - The connection options are type-cast due to Mongoose's TypeScript typing limitations.

------------------------------------------------------------------------------------*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;