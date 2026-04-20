'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admins', 'role', {
      type: Sequelize.ENUM('admin', 'cashier'),
      allowNull: false,
      defaultValue: 'admin'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('admins', 'role');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_admins_role";');
  }
};