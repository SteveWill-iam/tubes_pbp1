import Category from '../models/Category.js';
import Product from '../models/Product.js';

class CategoryService {
  async getAll(limit = 10, offset = 0) {
    const { count, rows } = await Category.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']],
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

  async create(name: string, description?: string) {
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new Error(`Category with name "${name}" already exists`);
    }

    const category = await Category.create({
      name,
      description: description || null,
    });

    return category;
  }

  async update(id: string, data: { name?: string; description?: string }) {
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

    await category.update(data);
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
