'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_addresses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userprofile_id: {
        type: Sequelize.STRING
       
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.STRING
      },
      addressline1: {
        type: Sequelize.STRING
      },
      addressline2: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      country_code: {
        type: Sequelize.STRING
      },
      contact_number: {
        type: Sequelize.STRING
      },
      default_billing: {
        type: Sequelize.BOOLEAN
      },
      default_shipping: {
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
    return queryInterface.dropTable('user_addresses');
  }
};