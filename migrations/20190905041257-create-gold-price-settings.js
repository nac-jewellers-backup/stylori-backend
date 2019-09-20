'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gold_price_settings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      material: {
        type: Sequelize.STRING
      },
      purity: {
        type: Sequelize.INTEGER
      },
      cost_price: {
        type: Sequelize.DOUBLE
      },
      selling_price_percentage:{
        type: Sequelize.DOUBLE
      },
      vendor_code:{
        type: Sequelize.STRING
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
    return queryInterface.dropTable('gold_price_settings');
  }
};