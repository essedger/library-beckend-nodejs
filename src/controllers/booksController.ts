import { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import secret from '../config';
import { getUserIdByToken, IMyToken } from '../utils/token';
import User from '../models/User';
import { Types, Query } from 'mongoose';

const sendGetBooksResponse = async (
  res: Response,
  query: Query<IBook[], IBook, {}, IBook>,
  page: number,
  perPage: number,
) => {
  const booksQueryClone = query.clone();
  const booksQueryFiltered = query.clone();
  const count = await booksQueryClone.countDocuments({});
  const books = await booksQueryFiltered
    .populate('owner', 'id')
    .populate('favoritedBy')
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();
  const totalPages = Math.ceil(count / perPage);
  await res.status(200).json({
    books: books,
    currentPage: page,
    totalPages: totalPages,
    totalBooks: count,
  });
};
class booksController {
  //Get all books
  async getBooks(req: Request, res: Response) {
    try {
      // number of books per page
      const perPage: number = parseInt(<string>req.query.per_page) || 10;
      // current page number
      const page = parseInt(<string>req?.query?.page) || 1;
      // search query string
      const isFavorites = Boolean(req.query.fav);
      const period = req.query.period;
      const userId = getUserIdByToken(req, res);
      const searchQuery = req.query.search;
      // case-insensitive search regex
      const searchRegex = searchQuery ? new RegExp(<string>searchQuery, 'i') : null;
      const booksQuery = Book.find<IBook>({ owner: userId });
      if (isFavorites) {
        booksQuery.where('favoritedBy').in([userId]);
      }
      if (period) {
        if (period === 'finished') {
          booksQuery.where('date_end').exists(true);
        }
        if (period === 'progress') {
          booksQuery.where('date_start').exists(true).where('date_finish').exists(false);
        }
      }
      if (searchRegex) {
        await booksQuery.or([{ name: searchRegex }, { author: searchRegex }]);
        await sendGetBooksResponse(res, booksQuery, page, perPage);
      } else {
        await sendGetBooksResponse(res, booksQuery, page, perPage);
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  //Get book by id
  async getBookById(req: Request, res: Response) {
    try {
      const param = req.params;
      const book = await Book.findById(param?.bookId).populate('owner', 'username').populate('favoritedBy', 'username');
      await res.status(200).json(book);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  //Delete book by id
  async deleteBookById(req: Request, res: Response) {
    try {
      const param = req.params;
      const book = await Book.findByIdAndRemove(param?.bookId);
      await res.status(200).json({ book, message: 'Book deleted successfully' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  //Add new book
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
      // const userEntity = await User.findOne({ userId });
      const book = new Book({ ...req.body, owner: userId });
      await book.save();
      return res.status(201).json({ book, message: 'Book is successfully added!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  //Edit book
  async patchBook(req: Request, res: Response) {
    // const token = req?.headers?.authorization?.split(' ')[1];
    // if (!token) {
    //   return res.status(403).json({ message: 'User is not authorized' });
    // }
    // const user = jwt.verify(token, secret) as IMyToken;
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ message: 'Unable to update book', errors });
      // }
      const param = req.params;
      const bookDoc = await Book.findOneAndUpdate({ _id: param?.bookId }, req.body, {
        new: true,
        upsert: true,
      });
      return res.status(200).json({ bookDoc, message: 'Book updated successfully!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  //Add book to favorites to current user
  async addBookToFavorites(req: Request, res: Response) {
    try {
      const userId = getUserIdByToken(req, res);
      const param = req.params;
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { favorite_books: param?.bookId } },
        { new: true },
      ).exec();
      const book = await Book.findById(param?.bookId);
      if (book) {
        book.favoritedBy.push(userId);
        await book.save();
      }
      if (updatedUser) {
        await res.status(200).json({ message: 'Successfully added to bookmarks!' });
      } else {
        return res.status(400).json({ message: 'Added to bookmarks failed!' });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  //Remove book from favorites to current user
  async removeBookFromFavorites(req: Request, res: Response) {
    const userId = getUserIdByToken(req, res);
    const bookId = new Types.ObjectId(req.params.bookId);
    try {
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);
      if (!user || !book) {
        return res.status(404).json({ message: 'Favorites not found' });
      } else if (user.favorite_books && book?.favoritedBy) {
        const indexBookInUser = user?.favorite_books.indexOf(bookId);
        const indexUserInBook = book?.favoritedBy.indexOf(user?.id);
        if (indexBookInUser === -1) {
          return res.status(404).json({ message: 'Book not found in favorites' });
        } else if (indexUserInBook === -1) {
          return res.status(404).json({ message: 'User not found book favorites' });
        } else {
          user.favorite_books.splice(indexBookInUser, 1);
          book.favoritedBy.splice(indexUserInBook, 1);
          await user.save();
          await book.save();
          return res.status(200).json({ message: 'Book deleted from favorites' });
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
}
export default new booksController();
