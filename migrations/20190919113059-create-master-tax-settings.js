'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('master_tax_settings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      hsn_number: {
        type: Sequelize.STRING
      },
      tax_name: {
        type: Sequelize.STRING
      },
      IGST: {
        type: Sequelize.DOUBLE
      },
      CGST: {
        type: Sequelize.DOUBLE
      },
      SGST: {
        type: Sequelize.DOUBLE
      },
     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      IGST: DataTypes.DOUBLE,
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('master_tax_settings');
  }
};