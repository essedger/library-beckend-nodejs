import { Response } from 'express';
import { IRequestWithAuthData } from '../interfaces/token';
import dotenv from 'dotenv';
dotenv.config();
const HOST_DOMAIN = process.env.HOST_DOMAIN;

class uploadController {
  //Upload image
  async uploadImage(req: IRequestWithAuthData, res: Response) {
    if (req?.file) {
      res.status(200).json({
        message: 'Image uploaded successfully',
        url: `${HOST_DOMAIN}/${req?.file?.path}`,
      });
    } else {
      res.status(400).json({message: 'Unsupported file type!'})
    }
  }
}

export default new uploadController();
