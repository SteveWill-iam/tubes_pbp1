import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export type ValidationSchema = {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
  };
};

export const validateBody = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        return next(new AppError(`Field '${field}' is required`, 400));
      }

      if (value !== undefined && value !== null && value !== '') {
        const expectedType = rules.type;
        let actualType: string = typeof value;

        if (Array.isArray(value)) {
          actualType = 'array';
        }

        if (actualType !== expectedType) {
          return next(new AppError(`Field '${field}' must be of type ${expectedType}`, 400));
        }
      }
    }

    next();
  };
};
