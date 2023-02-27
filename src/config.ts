import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET || '';

const secret = SECRET;

export default secret;
