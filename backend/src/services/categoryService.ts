import { Op } from 'sequelize';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

class CategoryService {
  async getAll(limit = 10, offset = 0, isAdmin = false) {
    let whereClause = {};

    if (!isAdmin) {
      // Get current date and time in local timezone
      const now = new Date();
      // Format as YYYY-MM-DD
      const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      // Format as HH:mm:ss
      const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

      whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              { start_date: { [Op.is]: null } },
              { start_date: { [Op.lte]: dateStr } }
            ]
          },
          {
            [Op.or]: [
              { end_date: { [Op.is]: null } },
              { end_date: { [Op.gte]: dateStr } }
            ]
          },
          {
            [Op.or]: [
              { start_time: { [Op.is]: null } },
              { start_time: { [Op.lte]: timeStr } }
            ]
          },
          {
            [Op.or]: [
              { end_time: { [Op.is]: null } },
              { end_time: { [Op.gte]: timeStr } }
            ]
          }
        ]
      };
    }

    const { count, rows } = await Category.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        limit,
        offset,
        pages: Math.ceil(count / limit),
      },
    };
  }

  async getById(id: string) {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] },
        },
      ],
    });

    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    return category;
  }

  async create(name: string, description?: string, sort_order?: number, start_date?: string, end_date?: string, start_time?: string, end_time?: string) {
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new Error(`Category with name "${name}" already exists`);
    }

    const category = await Category.create({
      name,
      description: description || null,
      sort_order: sort_order !== undefined ? sort_order : 0,
      start_date: start_date || null,
      end_date: end_date || null,
      start_time: start_time || null,
      end_time: end_time || null,
    });

    return category;
  }

  async update(id: string, data: { name?: string; description?: string; sort_order?: number; start_date?: string; end_date?: string; start_time?: string; end_time?: string; }) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    // Check if new name is unique (if being updated)
    if (data.name && data.name !== category.name) {
      const existingCategory = await Category.findOne({
        where: { name: data.name },
      });
      if (existingCategory) {
        throw new Error(`Category with name "${data.name}" already exists`);
      }
    }

    await category.update({
      name: data.name !== undefined ? data.name : category.name,
      description: data.description !== undefined ? data.description : category.description,
      sort_order: data.sort_order !== undefined ? data.sort_order : category.sort_order,
      start_date: data.start_date !== undefined ? data.start_date : category.start_date,
      end_date: data.end_date !== undefined ? data.end_date : category.end_date,
      start_time: data.start_time !== undefined ? data.start_time : category.start_time,
      end_time: data.end_time !== undefined ? data.end_time : category.end_time,
    });
    return category;
  }

  async delete(id: string) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    await category.destroy();
    return category;
  }

  async getProductsByCategory(categoryId: string) {
    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] },
        },
      ],
    });

    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    return category.products;
  }
}

export default new CategoryService();
