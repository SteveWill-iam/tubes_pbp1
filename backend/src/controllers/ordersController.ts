import { Request, Response } from 'express';
import { OrdersService } from '../services/ordersService.js';
import { OrderStatus } from '../models/Order.js';

export class OrdersController {
  static async create(req: Request, res: Response) {
    try {
      const { items, order_type } = req.body;

      if (!items || !order_type) {
        return res.status(400).json({ error: 'Items and order_type are required' });
      }

      const order = await OrdersService.createOrder({ items, order_type });
      res.status(201).json(order);
    } catch (error: any) {
      console.error('[Create Order Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      const result = await OrdersService.getOrders(limit, offset);
      res.json(result);
    } catch (error: any) {
      console.error('[Get Orders Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrdersService.getOrderById(id);
      res.json(order);
    } catch (error: any) {
      console.error('[Get Order Error]', error.message);
      res.status(404).json({ error: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: 'Valid status is required' });
      }

      const order = await OrdersService.updateOrderStatus(id, status);
      res.json(order);
    } catch (error: any) {
      console.error('[Update Order Status Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
