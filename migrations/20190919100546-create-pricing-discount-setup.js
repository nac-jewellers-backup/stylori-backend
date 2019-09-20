'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pricing_discount_setups', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
     
      material: {
        type: Sequelize.STRING
      },
      discount_type: {
        type: Sequelize.INTEGER
      },
      selling_price_min: {
        type: Sequelize.DOUBLE
      },
      selling_price_max: {
        type: Sequelize.DOUBLE
      },
      discount_value: {
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
    return queryInterface.dropTable('pricing_discount_setups');
  }
};