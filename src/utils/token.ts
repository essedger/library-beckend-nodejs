import jwt from 'jsonwebtoken';
import secret from '../config';
import { Request, Response } from 'express';
import { IMyToken } from '../interfaces/token';

export const generateAccessToken = (id: any, roles: any) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

export const getUserIdByToken = (req: Request, res: Response) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'User is not authorized' });
    }
    const user = jwt.verify(token, secret) as IMyToken;
    return user?.id;
  } catch (e) {
    console.log(e);
  }
};
