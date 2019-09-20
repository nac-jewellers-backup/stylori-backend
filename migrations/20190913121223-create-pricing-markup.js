'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pricing_markups', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      material: {
        type: Sequelize.STRING
      },
      markup_type: {
        type: Sequelize.INTEGER
      },
      selling_price_min: {
        type: Sequelize.DOUBLE
      },
      selling_price_max: {
        type: Sequelize.DOUBLE
      },
      markup_value: {
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
    return queryInterface.dropTable('pricing_markups');
  }
};