import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import fs from 'fs';

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  let { name, categories, price } = req.body;

  const cleanupFile = () => {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('[Cleanup Error]', err);
      }
    }
  };

  if (!name || !categories || !price) {
    cleanupFile();
    return next(new AppError('Name, categories, and price are required', 400));
  }

  // Handle categories if it comes as JSON string from FormData
  if (typeof categories === 'string') {
    try {
      categories = JSON.parse(categories);
      req.body.categories = categories; // Update req.body for the controller
    } catch (e) {
      cleanupFile();
      return next(new AppError('Invalid categories format', 400));
    }
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    cleanupFile();
    return next(new AppError('At least one category is required', 400));
  }

  next();
};
