'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'master_product_types',
        'certificate',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('master_product_types', 'certificate')

     ])
  }
};
