import { Product, Category } from '../models/index.js';

export interface CreateProductPayload {
  name: string;
  description?: string;
  categories: string[];
  price: number;
  image_url?: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  categories?: string[];
  price?: number;
  image_url?: string;
}

export class ProductService {
  static async getAll(limit: number = 100, offset: number = 0) {
    const { count, rows } = await Product.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] },
        },
      ],
    });

    return { total: count, products: rows };
  }

  static async getById(id: string) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] },
        },
      ],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  static async create(payload: CreateProductPayload) {
    const product = await Product.create({
      name: payload.name,
      description: payload.description || '',
      price: payload.price,
      image_url: payload.image_url || null,
    });

    // Set categories
    if (payload.categories && payload.categories.length > 0) {
      // Verify all category IDs exist
      const categories = await Category.findAll({
        where: { id: payload.categories },
      });

      if (categories.length !== payload.categories.length) {
        throw new Error('One or more category IDs do not exist');
      }

      await product.setCategories(payload.categories);
    }

    // Reload product with categories
    const productWithCategories = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] },
        },
      ],
    });

    return productWithCategories;
  }

  static async update(id: string, payload: UpdateProductPayload) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new Error('Product not found');
    }

    // Update basic fields
    const updateData = { ...payload };
    delete (updateData as any).categories; // Remove categories from update data

    Object.assign(product, updateData);
    await product.save();

    // Update categories if provided
    if (payload.categories && payload.categories.length > 0) {
      // Verify all category IDs exist
      const categories = await Category.findAll({
        where: { id: payload.categories },
      });

      if (categories.length !== payload.categories.length) {
        throw new Error('One or more category IDs do not exist');
      }

      await product.setCategories(payload.categories);
    } else if (payload.categories !== undefined && payload.categories.length === 0) {
      // Clear categories if explicitly set to empty (though not recommended)
      await product.setCategories([]);
    }

    // Reload product with categories
    const productWithCategories = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] },
        },
      ],
    });

    return productWithCategories;
  }

  static async delete(id: string) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new Error('Product not found');
    }

    await product.destroy();

    return { message: 'Product deleted successfully' };
  }
}
