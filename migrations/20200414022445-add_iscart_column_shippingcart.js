'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'shipping_charges',
        'is_cart',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('shipping_charges', 'is_cart')
  
     ])
  }
};
