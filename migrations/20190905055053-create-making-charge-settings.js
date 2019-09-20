'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('making_charge_settings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      vendor_code: {
        type: Sequelize.STRING
      },
      material: {
        type: Sequelize.STRING
      },
      purity: {
        type: Sequelize.INTEGER
      },
      weight_start: {
        type: Sequelize.DOUBLE
      },
      weight_end: {
        type: Sequelize.DOUBLE
      },
      rate_type: {
        type: Sequelize.INTEGER
      },
      cost_price: {
        type: Sequelize.DOUBLE
      },
      selling_price: {
        type: Sequelize.DOUBLE
      },
      selling_price_type:{
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('making_charge_settings');
  }
};