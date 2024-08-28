import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const generateToken = (idUsuario: number) => {
  return jwt.sign({ idUsuario }, JWT_SECRET, { expiresIn: '8h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
