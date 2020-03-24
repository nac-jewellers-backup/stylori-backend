'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'trans_sku_lists',
        'discount_desc',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      )
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('trans_sku_lists', 'discount_desc')
  
     ])
  }
};
