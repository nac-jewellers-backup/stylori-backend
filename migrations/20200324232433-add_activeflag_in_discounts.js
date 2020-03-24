'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'sale_discounts',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      )
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('sale_discounts', 'is_active')
  
     ])
  }
};
