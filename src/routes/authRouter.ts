import express from 'express';
import authController from '../controllers/authController';
import { check } from 'express-validator';
import roleMiddleware from '../middlewaree/roleMiddleware';
// import authMiddleware from './middlewaree/authMiddleware'
export const userRoute = express.Router();

userRoute.post(
  '/registration',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 10 символов').isLength({ min: 4, max: 10 }),
  ],
  authController.registration,
);
userRoute.post('/login', authController.login);
userRoute.get('/users', roleMiddleware(['ADMIN']), authController.getUsers);

export default userRoute;
