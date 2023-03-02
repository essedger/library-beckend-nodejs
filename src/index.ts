import express, { RequestHandler, Request } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer, { FileFilterCallback } from 'multer';
import { fileFilter } from './utils/multer';
import { fileStorage } from './config';
import cors from 'cors';
dotenv.config();

import userRoute from './routes/authRouter';
import router from './routes/home';
import booksRoute from './routes/booksRouter';
import uploadRoute from './routes/uploadRouter';

// .env variables
const PORT = process.env.PORT || 5005;
const USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_SERVER = process.env.SERVER_URL;
const DB_PORT = process.env.DB_PORT;


const app = express();

mongoose.set('strictQuery', true);
//Middleware
app.use(cors() as RequestHandler);
app.use(express.json());

//Routes
app.use(router);
app.use(userRoute);
app.use(booksRoute);
app.use(uploadRoute);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb://${USERNAME}:${DB_PASSWORD}@${DB_SERVER}:${DB_PORT}/?authMechanism=DEFAULT`
      // `mongodb+srv://${USERNAME}:${DB_PASSWORD}@library.yz89zfk.mongodb.net/?retryWrites=true&w=majority`,
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
