import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class ProductCategory extends Model {
  declare id: string;
  declare product_id: string;
  declare category_id: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ProductCategory',
    timestamps: true,
  }
);

export default ProductCategory;
