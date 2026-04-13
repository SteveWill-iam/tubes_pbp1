'use strict';

export async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    // Create Categories table
    await queryInterface.createTable(
      'categories',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      { transaction }
    );

    // Create ProductCategory join table
    await queryInterface.createTable(
      'ProductCategory',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        product_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        category_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'categories',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      { transaction }
    );

    // Drop category column from products table
    await queryInterface.removeColumn('products', 'category', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    // Add category column back to products
    await queryInterface.addColumn(
      'products',
      'category',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'General',
      },
      { transaction }
    );

    // Drop ProductCategory table
    await queryInterface.dropTable('ProductCategory', { transaction });

    // Drop Categories table
    await queryInterface.dropTable('categories', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
