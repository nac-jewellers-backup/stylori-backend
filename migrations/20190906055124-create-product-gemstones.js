'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_gemstones', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      gemstone_type: {
        type: Sequelize.STRING
      },
      gemstone_shape: {
        type: Sequelize.STRING
      },
      gemstone_setting: {
        type: Sequelize.STRING
      },
      gemstons_size: {
        type: Sequelize.INTEGER
      },
      stone_count: {
        type: Sequelize.INTEGER
      },
      stone_weight: {
        type: Sequelize.DOUBLE
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      gemstone_size:{
        type: Sequelize.STRING
      },
      product_sku: {
        type: Sequelize.STRING,
        references: {
          model: 'product_lists', // name of Source model
          key: 'product_id',
        }
      },
     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('product_gemstones');
  }
};