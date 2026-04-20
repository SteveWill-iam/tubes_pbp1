import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function up(queryInterface: any, Sequelize: any) {
  // Clean up existing data first (idempotent seeding)
  await queryInterface.bulkDelete('orders', {});
  await queryInterface.bulkDelete('products', {});
  await queryInterface.bulkDelete('admins', {});

  // Hash password for admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const cashierPassword = await bcrypt.hash('cashier123', 10);

  // Insert admin and cashier
  await queryInterface.bulkInsert('admins', [
    {
      id: uuidv4(),
      username: 'admin',
      password_hash: adminPassword,
      role: 'admin',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      username: 'cashier',
      password_hash: cashierPassword,
      role: 'cashier',
      created_at: new Date(),
    }
  ]);

  // Insert sample products
  await queryInterface.bulkInsert('products', [
    {
      id: uuidv4(),
      name: 'Burger Deluxe',
      description: 'Delicious burger with cheese and fresh vegetables',
      price: 50000,
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Chicken Sandwich',
      description: 'Crispy chicken sandwich with special sauce',
      price: 45000,
      image_url: 'https://images.unsplash.com/photo-1562547256-a6a8e6f97e65?w=300&h=300&fit=crop',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Veggie Pizza',
      description: 'Fresh vegetables on crispy pizza base',
      price: 60000,
      image_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Iced Tea',
      description: 'Refreshing iced tea',
      price: 15000,
      image_url: 'https://images.unsplash.com/photo-1554866585-e7b96551d9d1?w=300&h=300&fit=crop',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 20000,
      image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b61?w=300&h=300&fit=crop',
      created_at: new Date(),
    },
  ]);
}

export async function down(queryInterface: any, Sequelize: any) {
  await queryInterface.bulkDelete('products', {});
  await queryInterface.bulkDelete('admins', {});
}
