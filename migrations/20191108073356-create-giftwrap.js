'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('giftwraps', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      cart_id: {
        type: Sequelize.UUID,
        references: {
          model: 'shopping_carts', // name of Source model
          key: 'id',
        }
      },
      gift_from: {
        type: Sequelize.STRING
      },
      gift_to: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('giftwraps');
  }
};