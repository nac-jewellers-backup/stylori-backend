'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('material_markups', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      material_name: {
        type: Sequelize.STRING
      },
      markup_type: {
        type: Sequelize.INTEGER
      },
      price_min: {
        type: Sequelize.DOUBLE
      },
      price_max: {
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
    return queryInterface.dropTable('material_markups');
  }
};