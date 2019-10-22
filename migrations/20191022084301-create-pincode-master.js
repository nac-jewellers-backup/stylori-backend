'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pincode_masters', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      picode: {
        type: Sequelize.STRING
      },
      area: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DOUBLE
      },
      lng: {
        type: Sequelize.DOUBLE
      },
      is_cod: {
        type: Sequelize.BOOLEAN
      },
      is_delivery: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('pincode_masters');
  }
};