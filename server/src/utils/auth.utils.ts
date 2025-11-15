import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): { id: string; email: string } => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
