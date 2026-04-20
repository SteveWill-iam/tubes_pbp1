import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

interface AdminAttributes {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'cashier';
  created_at: Date;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'created_at' | 'role'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  declare id: string;
  declare username: string;
  declare password_hash: string;
  declare role: 'admin' | 'cashier';
  declare created_at: Date;
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
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: false,
  }
);

export default Admin;
