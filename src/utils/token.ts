import jwt from 'jsonwebtoken';
import secret from '../config';
import { IRole } from '../models/Role';

export interface IMyToken {
  id: string;
  exp: number;
  iat: number;
  roles: IRole[];
}

export const generateAccessToken = (id: any, roles: any) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};
