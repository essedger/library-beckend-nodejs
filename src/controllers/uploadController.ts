import { Response } from 'express';
import { IRequestWithAuthData } from '../interfaces/token';
import Book from '../models/Book';
import User from '../models/User';
import { getImageLinkWithHost } from '../utils/multer';

async function updateEntityByType (entity: string, id: string, imageUrl: string) {
  switch (entity) {
    case 'avatar': {
      const userDoc = await User.findOneAndUpdate({ _id: id }, {image: imageUrl}, {
        new: true,
        upsert: true,
      });
      return userDoc;
    }
    case 'book': {
      const bookDoc = await Book.findOneAndUpdate({ _id: id }, {image: imageUrl}, {
        new: true,
        upsert: true,
      });
      return bookDoc;
    }
  }
}

class uploadController {
  //Upload image
  async uploadImage(req: IRequestWithAuthData, res: Response) {
    const entityType = req?.body?.type;
    const entityId = req?.body?.entityId;
    if (req?.file?.path) {
      const imageUrl = getImageLinkWithHost(req?.file?.path)
      const updatedDoc = await updateEntityByType(entityType, entityId, imageUrl);
      if (req?.file && updatedDoc) {
        res.status(200).json({
          message: 'Image uploaded successfully',
          url: getImageLinkWithHost(req?.file?.path),
          entityType: updatedDoc,
        });
      } else {
        res.status(400).json({message: 'Unsupported file type!'})
      }
    }
  }
}

export default new uploadController();
