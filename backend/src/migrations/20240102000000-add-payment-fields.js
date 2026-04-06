export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('orders', 'payment_method', {
    type: DataTypes.ENUM('counter', 'machine'),
    defaultValue: 'machine',
    allowNull: false,
  });

  await queryInterface.addColumn('orders', 'payment_status', {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'completed',
    allowNull: false,
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('orders', 'payment_status');
  await queryInterface.removeColumn('orders', 'payment_method');
}
