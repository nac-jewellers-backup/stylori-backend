'use strict';

module.exports = {
  
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.addColumn(
      //   'vouchers',
      //   'isloginneeded',
      //   {
      //     type: Sequelize.BOOLEAN,
      //     allowNull: true
      //   }
      // )
    ]);


  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
    //  queryInterface.removeColumn('vouchers', 'isloginneeded')
    ]);
  }
};
