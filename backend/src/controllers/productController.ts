import { Request, Response } from 'express';
import { ProductService } from '../services/productService.js';

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      const result = await ProductService.getAll(limit, offset);
      res.json(result);
    } catch (error: any) {
      console.error('[Get Products Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductService.getById(id);
      res.json(product);
    } catch (error: any) {
      console.error('[Get Product Error]', error.message);
      res.status(404).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, description, category, price } = req.body;

      if (!name || !category || !price) {
        return res.status(400).json({ error: 'Name, category, and price are required' });
      }

      let image_url: string | undefined;

      // Handle file upload
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
      } else if (req.body.image_url) {
        image_url = req.body.image_url;
      }

      const product = await ProductService.create({
        name,
        description,
        category,
        price: parseInt(price),
        image_url,
      });

      res.status(201).json(product);
    } catch (error: any) {
      console.error('[Create Product Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, category, price } = req.body;

      let image_url: string | undefined;

      // Handle file upload
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
      } else if (req.body.image_url) {
        image_url = req.body.image_url;
      }

      const product = await ProductService.update(id, {
        name,
        description,
        category,
        price: price ? parseInt(price) : undefined,
        image_url,
      });

      res.json(product);
    } catch (error: any) {
      console.error('[Update Product Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ProductService.delete(id);
      res.json(result);
    } catch (error: any) {
      console.error('[Delete Product Error]', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
