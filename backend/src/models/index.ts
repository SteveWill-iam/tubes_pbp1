import Admin from './Admin.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

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

export { Admin, Product, Order, OrderItem };
