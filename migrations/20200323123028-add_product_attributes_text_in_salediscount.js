'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'sale_discounts',
        'product_attributes_text',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      )
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('sale_discounts', 'product_attributes_text')
  
     ])
  }
};
