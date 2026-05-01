import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return next(new AppError('Category name is required', 400));
  }

  next();
};
