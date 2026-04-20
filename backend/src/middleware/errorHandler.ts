import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]', err);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  if (err instanceof AppError && err.isOperational) {
    res.status(statusCode).json({
      status,
      message,
    });
  } else {
    // Standard unhandled error block (like database errors or syntax errors)
    res.status(statusCode).json({
      status: 'error',
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }
};
