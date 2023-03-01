import express from 'express';
import authController from '../controllers/authController';
import roleMiddleware from '../middlewares/roleMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import { loginValidation, registerValidation } from '../validations/validations';
// import authMiddleware from './middlewaree/authMiddleware'
export const userRoute = express.Router();

userRoute.post('/api/v1/register/', registerValidation, authController.register);
userRoute.post('/api/v1/login/', loginValidation, authController.login);
userRoute.get('/api/v1/users/', roleMiddleware(['ADMIN']), authController.getUsers);
userRoute.get('/api/v1/me/', authController.getMe);

export default userRoute;
