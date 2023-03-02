import { Request } from 'express';
import { IRole } from '../models/Role';

export interface IMyToken {
  id: string;
  exp: number;
  iat: number;
  roles: IRole[];
}

export interface IRequestWithAuthData extends Request {
  userToken?: IMyToken
}
