import { Admin } from '../models/index.js';
import bcrypt from 'bcrypt';

export class AdminService {
  static async getAll() {
    return await Admin.findAll({
      attributes: ['id', 'username', 'role', 'created_at'],
      order: [['created_at', 'DESC']]
    });
  }

  static async getById(id: string) {
    return await Admin.findByPk(id, {
      attributes: ['id', 'username', 'role', 'created_at']
    });
  }

  static async create(data: { username: string; password?: string; role: 'admin' | 'cashier' }) {
    if (!data.username || !data.password || !data.role) {
      throw new Error('Username, password, and role are required');
    }
    
    const existingUser = await Admin.findOne({ where: { username: data.username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const admin = await Admin.create({
      username: data.username,
      password_hash,
      role: data.role
    });

    const { password_hash: _, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  }

  static async update(id: string, data: { username?: string; password?: string; role?: 'admin' | 'cashier' }) {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      throw new Error('User not found');
    }

    if (data.username && data.username !== admin.username) {
      const existingUser = await Admin.findOne({ where: { username: data.username } });
      if (existingUser) {
        throw new Error('Username already exists');
      }
      admin.username = data.username;
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      admin.password_hash = await bcrypt.hash(data.password, salt);
    }

    if (data.role) {
      admin.role = data.role;
    }

    await admin.save();
    
    const { password_hash: _, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  }

  static async delete(id: string) {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      throw new Error('User not found');
    }
    await admin.destroy();
    return { message: 'User deleted successfully' };
  }
}