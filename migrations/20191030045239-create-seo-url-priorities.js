'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('seo_url_priorities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      attribute_name: {
        type: Sequelize.STRING
      },
      attribute_value: {
        type: Sequelize.STRING
      },
      seo_text: {
        type: Sequelize.STRING
      },
      seo_url: {
        type: Sequelize.STRING
      },
      priority: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('seo_url_priorities');
  }
};