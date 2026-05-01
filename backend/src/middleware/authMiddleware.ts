import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export interface AuthRequest extends Request {
  admin?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = decoded;
    next();
  } catch (error: any) {
    console.error('[Auth Error]', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin || !req.admin.role) {
      return res.status(403).json({ error: 'Role not found' });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }

    next();
  };
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Username and password are required', 400));
  }

  next();
};