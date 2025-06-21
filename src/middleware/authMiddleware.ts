import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;


if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ success:false, message: 'Invalid or expired token' });
  }
};
