import { Product } from '../models/index.js';

export interface CreateProductPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  image_url?: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  image_url?: string;
}

export class ProductService {
  static async getAll(limit: number = 100, offset: number = 0) {
    const { count, rows } = await Product.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { total: count, products: rows };
  }

  static async getById(id: string) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  static async create(payload: CreateProductPayload) {
    const product = await Product.create({
      name: payload.name,
      description: payload.description || '',
      category: payload.category,
      price: payload.price,
      image_url: payload.image_url || null,
    });

    return product;
  }

  static async update(id: string, payload: UpdateProductPayload) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, payload);
    await product.save();

    return product;
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
