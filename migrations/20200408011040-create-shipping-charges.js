'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shipping_charges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      zone_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'shipping_zones', // name of Source model
          key: 'id',
        }
      },
      name: {
        type: Sequelize.STRING
      },
      charge_type: {
        type: Sequelize.INTEGER
      },
      range_from: {
        type: Sequelize.DOUBLE
      },
      range_to: {
        type: Sequelize.DOUBLE
      },
      shipment_charge: {
        type: Sequelize.DOUBLE
      },
      product_attributes: {
        type: Sequelize.JSON,
      },
      display_attributes: {
        type: Sequelize.TEXT,
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
    return queryInterface.dropTable('shipping_charges');
  }
};