'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gemstone_price_settings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      gemstone_type: {
        type: Sequelize.STRING
      },
      vendor_code: {
        type: Sequelize.STRING
      },
      weight_start: {
        type: Sequelize.DOUBLE
      },
      weight_end: {
        type: Sequelize.DOUBLE
      },
      selling_price_type: {
        type: Sequelize.INTEGER
      },
      cost_price: {
        type: Sequelize.DOUBLE
      },
      selling_price: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gemstone_price_settings');
  }
};