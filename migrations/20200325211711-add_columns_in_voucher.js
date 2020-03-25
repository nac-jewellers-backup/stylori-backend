'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'vouchers',
        'max_discount',
        {
          type: Sequelize.DOUBLE,
          allowNull: true
        }
      ),
      
      queryInterface.addColumn(
        'vouchers',
        'min_cart_qty',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'vouchers',
        'voucher_codes',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('vouchers', 'voucher_codes'),
      queryInterface.removeColumn('vouchers', 'min_cart_qty'),
      queryInterface.removeColumn('vouchers', 'max_discount')

     ])
  }
};
