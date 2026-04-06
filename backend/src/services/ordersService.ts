import { Order, OrderItem, Product } from '../models/index.js';
import { OrderStatus, OrderType } from '../models/Order.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CartItem[];
  order_type: OrderType;
}

export class OrdersService {
  static async generateQueueNumber(): Promise<number> {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find max queue_number for today (simplified approach)
    const lastOrder = await Order.findOne({
      where: sequelize.where(
        sequelize.fn('DATE', sequelize.col('created_at')),
        Op.eq,
        sequelize.fn('DATE', today)
      ),
      order: [['queue_number', 'DESC']],
    });

    return lastOrder ? lastOrder.queue_number + 1 : 1;
  }

  static async createOrder(payload: CreateOrderPayload) {
    const { items, order_type } = payload;

    if (!items || items.length === 0) {
      throw new Error('Cart cannot be empty');
    }

    // Fetch products and calculate total
    let totalPrice = 0;
    const productMap: Record<string, any> = {};
    const productIds = items.map((item) => item.product_id);

    const products = await Product.findAll({
      where: { id: productIds },
    });

    for (const product of products) {
      productMap[product.id] = product;
    }

    // Validate all products exist and calculate total
    for (const item of items) {
      if (!productMap[item.product_id]) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      totalPrice += productMap[item.product_id].price * item.quantity;
    }

    // Generate queue number
    const queueNumber = await this.generateQueueNumber();

    // Create order
    const order = await Order.create({
      queue_number: queueNumber,
      status: OrderStatus.PROCESSED,
      order_type,
      total_price: totalPrice,
    });

    // Create order items (price snapshot)
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: productMap[item.product_id].price,
    }));

    await OrderItem.bulkCreate(orderItems);

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{ association: 'items', include: [{ association: 'product' }] }],
    });

    return completeOrder;
  }

  static async getOrders(limit: number = 100, offset: number = 0) {
    const { count, rows } = await Order.findAndCountAll({
      include: [{ association: 'items', include: [{ association: 'product' }] }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { total: count, orders: rows };
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    return order;
  }

  static async getOrderById(orderId: string) {
    const order = await Order.findByPk(orderId, {
      include: [{ association: 'items', include: [{ association: 'product' }] }],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}
