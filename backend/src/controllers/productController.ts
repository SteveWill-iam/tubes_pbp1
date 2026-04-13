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
      let { name, description, categories, price } = req.body;

      if (!name || !categories || !price) {
        return res.status(400).json({ error: 'Name, categories, and price are required' });
      }

      // Parse categories if it comes as JSON string from FormData
      if (typeof categories === 'string') {
        try {
          categories = JSON.parse(categories);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid categories format' });
        }
      }

      // Validate categories is an array
      if (!Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ error: 'At least one category is required' });
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
        categories,
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
      let { name, description, categories, price } = req.body;

      // Parse categories if it comes as JSON string from FormData
      if (categories && typeof categories === 'string') {
        try {
          categories = JSON.parse(categories);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid categories format' });
        }
      }

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
        categories,
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
