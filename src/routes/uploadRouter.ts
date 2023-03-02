import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { upload } from '../config';
import uploadController from '../controllers/uploadController';

export const uploadRoute = express.Router();

uploadRoute.use('/api/v1/uploads/', express.static('uploads'));
// send to upload multipart/form-data!
uploadRoute.post('/api/v1/upload/', upload.single('image'), authMiddleware, uploadController.uploadImage);

export default uploadRoute;
