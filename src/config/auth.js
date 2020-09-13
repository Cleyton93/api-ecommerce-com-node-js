import jwt from 'express-jwt';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET;

const getTokenFromHeader = (req) => {
  if (!req.headers.authorization) return null;

  const token = req.headers.authorization.split(' ');

  if (token[0] !== 'Ecommerce') return null;

  return token[1];
};

const auth = {
  required: jwt({
    secret,
    algorithms: ['HS256'],
    userProperty: 'payload',
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret,
    algorithms: ['HS256'],
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

export default auth;
