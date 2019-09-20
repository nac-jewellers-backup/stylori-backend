'use strict';
const uuidv1 = require('uuid/v1');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('master_vendors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuidv1(),
      },
      name: {
        type: Sequelize.STRING
      },
      short_code: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      vendor_delivary_days: {
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.STRING
      },
      gst_no: {
        type: Sequelize.STRING
      },
      partner_category: {
        type: Sequelize.STRING
      },
      organization: {
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
    return queryInterface.dropTable('master_vendors');
  }
};