'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('diamond_price_settings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      vendor_code: {
        type: Sequelize.STRING
      },
      diamond_colour: {
        type: Sequelize.STRING
      },
      diamond_clarity: {
        type: Sequelize.STRING
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
  down: (queryInterface) => {
    return queryInterface.dropTable('diamond_price_settings');
  }
};