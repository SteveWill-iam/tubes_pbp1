import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
  PROCESSED = 'processed',
  COMPLETED = 'completed',
}

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
}

interface OrderAttributes {
  id: string;
  queue_number: number;
  status: OrderStatus;
  order_type: OrderType;
  total_price: number;
  created_at: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'created_at'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  declare id: string;
  declare queue_number: number;
  declare status: OrderStatus;
  declare order_type: OrderType;
  declare total_price: number;
  declare created_at: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    queue_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.PROCESSED,
      allowNull: false,
    },
    order_type: {
      type: DataTypes.ENUM(...Object.values(OrderType)),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: false,
  }
);

export default Order;
