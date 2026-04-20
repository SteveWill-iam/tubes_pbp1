import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Category extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public sort_order!: number | null;
  public start_date!: string | null;
  public end_date!: string | null;
  public start_time!: string | null;
  public end_time!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  declare products?: any[];
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
  }
);

export default Category;
