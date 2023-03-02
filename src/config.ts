import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import { Request } from 'express';
import { fileFilter } from './utils/multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const SECRET = process.env.SECRET || '';
const secret = SECRET;

export default secret;

export const fileStorage = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null, 'uploads')
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    const guid = uuidv4();
    callback(null, `${guid}-${file.originalname.replace(' ', '')}`);
  },
});

export const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10485760,
  },
});
