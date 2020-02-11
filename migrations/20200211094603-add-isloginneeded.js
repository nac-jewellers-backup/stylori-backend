'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'vouchers',
        'isloginneeded',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      )
    ];


  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('vouchers', 'isloginneeded')
    ];
  }
};
