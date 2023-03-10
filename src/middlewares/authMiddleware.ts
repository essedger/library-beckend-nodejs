import jwt from 'jsonwebtoken';
import secret from '../config';

const authMiddleware = function (req: any, res: any, next: any) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'User is not authorized' });
    }
    const decodedData = jwt.verify(token, secret);
    req.userToken = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: 'User is not authorized' });
  }
};

export default authMiddleware;
