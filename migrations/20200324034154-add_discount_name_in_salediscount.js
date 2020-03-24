'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.addColumn(
      'sale_discounts',
      'discount_name',
      {
        type: Sequelize.TEXT,
        allowNull: true
      }
    )
    
  ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('sale_discounts', 'discount_name')
  
     ])
  }
};
