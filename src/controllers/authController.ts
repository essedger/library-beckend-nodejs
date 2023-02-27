import User from '../models/User';
import { Role } from '../models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import secret from '../config';
import { Request, Response } from 'express';
import { generateAccessToken, IMyToken } from '../utils/token';

class authController {
  //User register
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ name: 'USER' });
      const user = new User({ ...req.body, password: hashPassword, roles: [userRole] });
      await user.save();
      const newUser = await User.findOne({ email }).select('-password');
      return res
        .status(201)
        .json({ user: newUser, message: 'User is successfully registered!' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Registration error' });
    }
  }
  //Login by username and password
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `Wrong login or password` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Wrong login or password` });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      await res.status(400).json({ message: 'Login error' });
    }
  }
  //Get all users
  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      await res.status(200).json(users);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
  //Get me info
  async getMe(req: Request, res: Response) {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'User is not authorized' });
    }
    const user = jwt.verify(token, secret) as IMyToken;
    try {
      const userId = user?.id;
      const me = await User.findById(userId).select('-password');
      if (me) {
        const token = generateAccessToken(me.id, me.roles);
        await res.status(200).json({ user: me, token });
      } else {
        return res.status(400).json({ message: 'No user found' });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
}

export default new authController();
