'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shopping_cart_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      shopping_cart_id: {
        type: Sequelize.UUID,
        references: {
          model: 'shopping_carts', 
          key: 'id',
        }
      },
      product_sku: {
        type: Sequelize.STRING,
        references: {
          model: 'trans_sku_lists', 
          key: 'generated_sku',
        }
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DOUBLE
      },
      offer_price: {
        type: Sequelize.DOUBLE
      },
      is_active: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('shopping_cart_items');
  }
};