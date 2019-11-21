'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_whislists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userprofile_id: {
        type: Sequelize.UUID,
        references: {
          model: 'user_profiles', // name of Source model
          key: 'id',
        }
      },
      product_id: {
        type: Sequelize.STRING,
        references: {
          model: 'product_lists', // name of Source model
          key: 'product_id',
        }
      },
      sku_id: {
        type: Sequelize.STRING,
        references: {
          model: 'trans_sku_lists', // name of Source model
          key: 'generated_sku',
        }
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
    return queryInterface.dropTable('user_whislists');
  }
};