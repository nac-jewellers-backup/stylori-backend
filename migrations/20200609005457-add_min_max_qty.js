'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'trans_sku_lists',
        'min_order_qty',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'trans_sku_lists',
        'max_order_qty',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
     
    ]);
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('trans_sku_lists', 'min_order_qty'),
    queryInterface.removeColumn('trans_sku_lists', 'max_order_qty')

  }
};
