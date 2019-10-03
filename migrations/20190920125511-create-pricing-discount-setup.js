'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pricing_discount_setups', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      discount_type: {
        type: Sequelize.INTEGER
      },
      discount_value: {
        type: Sequelize.DOUBLE
      },
      diamond_discount: {
        type: Sequelize.DOUBLE
      },
      gemstone_discount: {
        type: Sequelize.DOUBLE
      },
      makingcharge_discount: {
        type: Sequelize.DOUBLE
      },
      goldprice_discount: {
        type: Sequelize.DOUBLE
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
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