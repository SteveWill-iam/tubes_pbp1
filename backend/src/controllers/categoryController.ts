import { Request, Response } from 'express';
import categoryService from '../services/categoryService.js';

export class CategoryController {
  async getAll(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await categoryService.getAll(limit, offset);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.getById(id);

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Category not found',
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Category name is required',
        });
      }

      const category = await categoryService.create(name, description);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create category',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await categoryService.update(id, { name, description });

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update category',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await categoryService.delete(id);

      res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete category',
      });
    }
  }
}

export default new CategoryController();
