'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_diamonds', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      diamond_colour: {
        type: Sequelize.STRING
      },
      diamond_clarity: {
        type: Sequelize.STRING
      },
      diamond_settings: {
        type: Sequelize.STRING
      },
      diamond_shape: {
        type: Sequelize.STRING
      },
      stone_cont: {
        type: Sequelize.INTEGER
      },
      stone_weight: {
        type: Sequelize.DOUBLE
      },
      diamond_type: {
        type: Sequelize.STRING
      },
      stone_count:{
        type: Sequelize.INTEGER

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
    return queryInterface.dropTable('product_diamonds');
  }
};