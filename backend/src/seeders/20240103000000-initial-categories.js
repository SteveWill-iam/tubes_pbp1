'use strict';

import { v4 as uuidv4 } from 'uuid';

export async function up(queryInterface, Sequelize) {
  const categories = [
    { id: uuidv4(), name: 'Sarapan Pagi', description: 'Menu sarapan pagi' },
    { id: uuidv4(), name: 'Daging Sapi', description: 'Menu dengan daging sapi' },
    { id: uuidv4(), name: 'Ayam', description: 'Menu dengan ayam' },
    { id: uuidv4(), name: 'Ikan', description: 'Menu dengan ikan' },
    { id: uuidv4(), name: 'Minuman', description: 'Berbagai macam minuman' },
    { id: uuidv4(), name: 'Makanan Penutup', description: 'Dessert dan makanan penutup' },
    { id: uuidv4(), name: 'Happy Meal', description: 'Paket happy meal' },
    { id: uuidv4(), name: 'McCafe', description: 'Menu McCafe' },
    { id: uuidv4(), name: 'Cemilan', description: 'Cemilan dan snack' },
    { id: uuidv4(), name: 'PaHe (Paket Hemat)', description: 'Paket hemat dan promo' },
  ];

  const now = new Date();
  const categoriesWithTimestamps = categories.map((cat) => ({
    ...cat,
    createdAt: now,
    updatedAt: now,
  }));

  await queryInterface.bulkInsert('categories', categoriesWithTimestamps);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('categories', null, {});
}
