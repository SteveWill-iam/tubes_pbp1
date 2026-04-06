import { Order } from '../models/index.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

export class StatsService {
  static async getStats() {
    // Get start of today in UTC
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

    // Total orders
    const totalOrdersResult = await Order.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue'],
      ],
      raw: true,
    });

    // Today's orders 
    const todayOrdersResult = await Order.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue'],
      ],
      where: {
        created_at: {
          [Op.gte]: todayStart,
          [Op.lte]: todayEnd,
        },
      },
      raw: true,
    });

    const totalOrders = parseInt((totalOrdersResult[0] as any)?.total || 0);
    const totalRevenue = parseInt((totalOrdersResult[0] as any)?.revenue || 0);
    const todayOrders = parseInt((todayOrdersResult[0] as any)?.total || 0);
    const todayRevenue = parseInt((todayOrdersResult[0] as any)?.revenue || 0);

    return {
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      today_orders: todayOrders,
      today_revenue: todayRevenue,
      timestamp: new Date().toISOString(),
    };
  }
}
