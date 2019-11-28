'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cart_id: {
        type: Sequelize.UUID,
        references: {
          model: 'shopping_carts', // name of Source model
          key: 'id',
        }
      },
      user_profile_id: {
        type: Sequelize.UUID,
        references: {
          model: 'user_profiles', // name of Source model
          key: 'id',
        }
      },
      payment_mode: {
        type: Sequelize.INTEGER
      },
      payment_status: {
        type: Sequelize.INTEGER
      },
      order_status: {
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
    return queryInterface.dropTable('orders');
  }
};