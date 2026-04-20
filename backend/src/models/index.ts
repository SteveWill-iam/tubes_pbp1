import Admin from './Admin.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Category from './Category.js';
import ProductCategory from './ProductCategory.js';

// Setup associations
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
  onDelete: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// M:N relationship between Product and Category
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: 'categories',
});

Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: 'products',
});

export { Admin, Product, Order, OrderItem, Category, ProductCategory };
