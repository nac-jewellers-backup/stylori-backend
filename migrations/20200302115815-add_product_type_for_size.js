'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
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
      
    ];
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('master_rings_sizes', 'product_type'),
   queryInterface.removeColumn('master_rings_sizes', 'ringsize_image')

  }
};
