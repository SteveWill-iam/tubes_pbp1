export async function up (queryInterface, Sequelize) {
  await queryInterface.addColumn('categories', 'sort_order', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  });
  await queryInterface.addColumn('categories', 'start_date', {
    type: Sequelize.DATEONLY,
    allowNull: true
  });
  await queryInterface.addColumn('categories', 'end_date', {
    type: Sequelize.DATEONLY,
    allowNull: true
  });
  await queryInterface.addColumn('categories', 'start_time', {
    type: Sequelize.TIME,
    allowNull: true
  });
  await queryInterface.addColumn('categories', 'end_time', {
    type: Sequelize.TIME,
    allowNull: true
  });
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('categories', 'sort_order');
  await queryInterface.removeColumn('categories', 'start_date');
  await queryInterface.removeColumn('categories', 'end_date');
  await queryInterface.removeColumn('categories', 'start_time');
  await queryInterface.removeColumn('categories', 'end_time');
}
