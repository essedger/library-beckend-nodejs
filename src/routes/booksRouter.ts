import express from 'express';
import authController from '../controllers/authController';
import roleMiddleware from '../middlewares/roleMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import { loginValidation, postBookValidation, registerValidation } from '../validations/validations';
import booksController from '../controllers/booksController';
// import authMiddleware from './middlewaree/authMiddleware'
export const booksRoute = express.Router();

booksRoute.get('/api/v1/books/', booksController.getBooks);
booksRoute.post('/api/v1/book/', postBookValidation, booksController.postBook);
booksRoute.get('/api/v1/book/:bookId/', booksController.getBookById);
// userRoute.post('/api/v1/login/', loginValidation, authController.login);
// userRoute.get('/api/v1/users/', roleMiddleware(['ADMIN']), authController.getUsers);
// userRoute.get('/api/v1/me/', authMiddleware, authController.getMe);

export default booksRoute;
