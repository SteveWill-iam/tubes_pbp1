import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'created_at' | 'image_url'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare image_url: string | null;
  declare created_at: Date;
  
  declare setCategories: (categories: any) => Promise<void>;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: false,
  }
);

export default Product;
