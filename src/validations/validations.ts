import { check } from 'express-validator';

export const registerValidation = [
  check('username', 'Username cannot be empty').notEmpty(),
  check('email', 'Email cannot be empty').notEmpty(),
  check('username', 'Username must be more than 4 characters').isLength({ min: 4 }),
  check('password', 'Password must be more than 4 characters').isLength({ min: 4 }),
];

export const loginValidation = [
  check('email', 'Email cannot be empty').notEmpty(),
  check('password', 'Password  cannot be empty').notEmpty(),
];

export const postBookValidation = [
  check('name', 'Book name cannot be empty').notEmpty(),
  check('author', 'Author name cannot be empty').notEmpty(),
  check('name', 'Book name must be more than 4 characters').isLength({ min: 4 }),
  check('author', 'Author name must be more than 4 characters').isLength({ min: 4 }),
]