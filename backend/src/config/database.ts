import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tubes',
  process.env.DB_USERNAME || 'postgres',
  process.env.DB_PASSWORD || '@awsed121;',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    pool: {
      max: 10,
      min: 0,
      idle: 30000,
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
  }
);

export default sequelize;
