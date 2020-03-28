'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'master_tax_settings',
        'IGST',
        {
          type: Sequelize.DOUBLE,
          allowNull: true
        }
      ),
      
      queryInterface.addColumn(
        'master_tax_settings',
        'CGST',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('master_tax_settings', 'IGST'),
      queryInterface.removeColumn('master_tax_settings', 'CGST')

     ])
  }
};
