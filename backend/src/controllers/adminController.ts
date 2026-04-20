import { Request, Response } from 'express';
import { AdminService } from '../services/adminService.js';

export class AdminController {
  static async getAll(req: Request, res: Response) {
    try {
      const admins = await AdminService.getAll();
      res.json(admins);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const admin = await AdminService.getById(req.params.id);
      if (admin) {
        res.json(admin);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const admin = await AdminService.create(req.body);
      res.status(201).json(admin);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const admin = await AdminService.update(req.params.id, req.body);
      res.json(admin);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await AdminService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}