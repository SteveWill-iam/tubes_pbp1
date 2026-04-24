'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admins', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('admins', 'nama', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('admins', 'reset_otp', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('admins', 'reset_otp_expires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('admins', 'email');
    await queryInterface.removeColumn('admins', 'nama');
    await queryInterface.removeColumn('admins', 'reset_otp');
    await queryInterface.removeColumn('admins', 'reset_otp_expires');
  }
};