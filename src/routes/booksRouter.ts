import express from 'express';
import authController from '../controllers/authController';
import roleMiddleware from '../middlewares/roleMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import {
  loginValidation,
  patchBookValidation,
  postBookValidation,
  registerValidation,
} from '../validations/validations';
import booksController from '../controllers/booksController';
// import authMiddleware from './middlewaree/authMiddleware'
export const booksRoute = express.Router();

booksRoute.get('/api/v1/book/', booksController.getBooks);
booksRoute.post('/api/v1/book/', postBookValidation, booksController.postBook);
booksRoute.get('/api/v1/book/:bookId/', booksController.getBookById);
booksRoute.delete('/api/v1/book/:bookId/', booksController.deleteBookById);
//TODO patch validations (patchBookValidation)
booksRoute.patch('/api/v1/book/:bookId/', booksController.patchBook);
booksRoute.put('/api/v1/book/:bookId/favorites/add', booksController.addBookToFavorites);
booksRoute.put('/api/v1/book/:bookId/favorites/delete', booksController.removeBookFromFavorites);
// userRoute.post('/api/v1/login/', loginValidation, authController.login);
// userRoute.get('/api/v1/users/', roleMiddleware(['ADMIN']), authController.getUsers);
// userRoute.get('/api/v1/me/', authMiddleware, authController.getMe);

export default booksRoute;
