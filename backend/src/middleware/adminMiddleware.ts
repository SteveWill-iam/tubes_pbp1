import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models/index.js';
import { Op } from 'sequelize';
import { AppError } from '../utils/AppError.js';

export const validateUniqueAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email } = req.body;
  const { id } = req.params; // For updates

  try {
    if (username) {
      const existingUsername = await Admin.findOne({
        where: {
          username,
          ...(id && { id: { [Op.ne]: id } }),
        },
      });

      if (existingUsername) {
        return next(new AppError('Username is already taken', 400));
      }
    }

    if (email) {
      const existingEmail = await Admin.findOne({
        where: {
          email,
          ...(id && { id: { [Op.ne]: id } }),
        },
      });

      if (existingEmail) {
        return next(new AppError('Email is already registered', 400));
      }
    }

    next();
  } catch (error: any) {
    next(error);
  }
};
