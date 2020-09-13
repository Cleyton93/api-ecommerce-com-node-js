import dotenv from 'dotenv';

dotenv.config();

export default {
  host: 'smpt.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
};
