import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

interface AdminAttributes {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'cashier';
  created_at: Date;
  email?: string;
  nama?: string;
  reset_otp?: string | null;
  reset_otp_expires?: Date | null;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'created_at' | 'role'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  declare id: string;
  declare username: string;
  declare password_hash: string;
  declare role: 'admin' | 'cashier';
  declare created_at: Date;
  declare email?: string;
  declare nama?: string;
  declare reset_otp?: string | null;
  declare reset_otp_expires?: Date | null;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'cashier'),
      allowNull: false,
      defaultValue: 'admin',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_otp_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: false,
  }
);

export default Admin;
