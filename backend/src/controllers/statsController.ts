import { Request, Response } from 'express';
import { StatsService } from '../services/statsService.js';

export class StatsController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await StatsService.getStats();
      res.json(stats);
    } catch (error: any) {
      console.error('[Get Stats Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
