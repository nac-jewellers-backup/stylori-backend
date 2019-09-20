'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('trans_sku_lists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      purity: {
        type: Sequelize.INTEGER
      },
      metal_color: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.STRING
      },
      isdefault: {
        type: Sequelize.BOOLEAN
      },
      diamond_type: {
        type: Sequelize.STRING
      },
      generated_sku: {
        type: Sequelize.STRING
      },
      sku_weight:{
        type: Sequelize.DOUBLE
      }, 
      cost_price:{
        type: Sequelize.DOUBLE
      },
      selling_price:{
        type: Sequelize.DOUBLE
      }, 
      margin_on_sale_percentage:{
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('trans_sku_lists');
  }
};