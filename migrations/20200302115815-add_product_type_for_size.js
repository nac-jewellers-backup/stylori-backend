'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'master_rings_sizes',
        'product_type',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_rings_sizes',
        'gender',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.removeColumn('master_rings_sizes', 'product_type'),
   queryInterface.removeColumn('master_rings_sizes', 'ringsize_image')
    ]);
  }
};
