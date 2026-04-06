import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (error: any) {
      console.error('[Login Error]', error.message);
      res.status(401).json({ error: error.message });
    }
  }
}
