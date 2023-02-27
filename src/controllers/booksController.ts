import { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import secret from '../config';
import { IMyToken } from '../utils/token';
import User from '../models/User';

class booksController {
  //Get all books
  async getBooks(req: Request, res: Response) {
    try {
      const books = await Book.find<IBook>();
      await res.status(200).json({books: books});
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  async getBookById(req: Request, res: Response) {
    try {
      const param = req.params
      const book = await Book.findById(param?.bookId);
      await res.status(200).json(book);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  async postBook(req: Request, res: Response) {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'User is not authorized' });
    }
    const user = jwt.verify(token, secret) as IMyToken;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Unable to add book', errors });
      }
      const userId = user?.id;
      const userEntity = await User.findOne({ userId });
      const book = new Book({...req.body, owner: userEntity});
      await book.save();
      return res
        .status(201)
        .json({ book, message: 'Book is successfully added!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
}
export default new booksController();