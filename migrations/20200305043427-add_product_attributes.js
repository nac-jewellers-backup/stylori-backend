'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'product_lists',
        'attributes',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: true
        }
      )
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('product_lists', 'attributes')
   
      ])
  }
};
