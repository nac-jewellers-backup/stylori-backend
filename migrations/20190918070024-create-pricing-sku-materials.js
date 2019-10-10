'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pricing_sku_materials', {
      id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      component: {
        allowNull: true,
        type: Sequelize.STRING
      },
      material_name: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.STRING
      },
      product_sku: {
        type: Sequelize.STRING,
        primaryKey: true,

      },
      cost_price: {
        type: Sequelize.DOUBLE
      },
      selling_price: {
        type: Sequelize.DOUBLE
      },
      markup: {
        type: Sequelize.DOUBLE
      },
      discount_price: {
        type: Sequelize.DOUBLE
      },
      margin_percentage: {
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
    return queryInterface.dropTable('pricing_sku_materials');
  }
};