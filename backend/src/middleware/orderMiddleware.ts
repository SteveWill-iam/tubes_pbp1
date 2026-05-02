import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { OrderStatus, PaymentMethod } from '../models/Order.js';

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { items, order_type, payment_method } = req.body;

  if (!items || !order_type) {
    return next(new AppError('Items and order_type are required', 400));
  }

  if (payment_method && !Object.values(PaymentMethod).includes(payment_method)) {
    return next(new AppError('Invalid payment_method', 400));
  }

  next();
};

export const validateOrderStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;

  if (!status || !Object.values(OrderStatus).includes(status)) {
    return next(new AppError('Valid status is required', 400));
  }

  next();
};
