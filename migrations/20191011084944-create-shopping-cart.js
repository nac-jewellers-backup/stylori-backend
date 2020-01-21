'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shopping_carts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userprofile_id: {
        type: Sequelize.UUID,
        references: {
          model: 'user_profiles', // name of Source model
          key: 'id',
        }
      },
      gross_amount: {
        type: Sequelize.DOUBLE
      },
      discount: {
        type: Sequelize.DOUBLE
      },
      discounted_price: {
        type: Sequelize.DOUBLE
      },
      tax_amount: {
        type: Sequelize.DOUBLE
      },
      net_amount: {
        type: Sequelize.DOUBLE
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      status: {
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
    return queryInterface.dropTable('shopping_carts');
  }
};