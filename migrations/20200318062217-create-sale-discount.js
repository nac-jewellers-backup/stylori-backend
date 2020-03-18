'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sale_discounts', {
     
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      components: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      product_ids: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      attributes: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
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
    return queryInterface.dropTable('sale_discounts');
  }
};