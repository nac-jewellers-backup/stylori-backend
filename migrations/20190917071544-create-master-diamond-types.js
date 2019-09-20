'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('master_diamond_types', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      diamond_color: {
        type: Sequelize.STRING
      },
      diamond_clarity: {
        type: Sequelize.STRING
      },
      short_code: {
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
    return queryInterface.dropTable('master_diamond_types');
  }
};