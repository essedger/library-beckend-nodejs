import express, { RequestHandler } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import userRoute from './routes/authRouter';

const PORT = process.env.PORT || 5005;
const USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const app = express();

app.use(cors() as RequestHandler);
app.use(express.json());
app.use(userRoute);

console.log(`mongodb+srv://${USERNAME}:${DB_PASSWORD}@library.yz89zfk.mongodb.net/?retryWrites=true&w=majority`);
const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${USERNAME}:${DB_PASSWORD}@library.yz89zfk.mongodb.net/?retryWrites=true&w=majority`,
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
