import { FileFilterCallback } from 'multer';
import { Request } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const HOST_DOMAIN = process.env.HOST_DOMAIN;

export const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

export const getImageLinkWithHost = (imageUrl: string) => {
  return `${HOST_DOMAIN}/${imageUrl}`
}
