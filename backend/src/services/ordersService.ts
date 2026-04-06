import { Order, OrderItem, Product } from '../models/index.js';
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from '../models/Order.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CartItem[];
  order_type: OrderType;
  payment_method?: PaymentMethod;
}

export class OrdersService {
  static async generateQueueNumber(): Promise<number> {
    // Get today's date range (midnight to end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find max queue_number for today with date range filter (more reliable than DATE function)
    const lastOrder = await Order.findOne({
      where: {
        created_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
      order: [['queue_number', 'DESC']],
    });

    return lastOrder ? lastOrder.queue_number + 1 : 1;
  }

  static async createOrder(payload: CreateOrderPayload) {
    const { items, order_type, payment_method = PaymentMethod.MACHINE } = payload;

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

    // Determine payment status based on payment method
    const paymentStatus = payment_method === PaymentMethod.COUNTER 
      ? PaymentStatus.PENDING 
      : PaymentStatus.COMPLETED;

    // Create order
    const order = await Order.create({
      queue_number: queueNumber,
      status: OrderStatus.PROCESSED,
      order_type,
      total_price: totalPrice,
      payment_method,
      payment_status: paymentStatus,
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

  static async confirmPayment(orderId: string) {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.payment_status === PaymentStatus.COMPLETED) {
      throw new Error('Payment already confirmed');
    }

    order.payment_status = PaymentStatus.COMPLETED;
    await order.save();

    return order;
  }
}
