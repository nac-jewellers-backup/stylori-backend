'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'vouchers',
        'product_attributes',
        {
          type: Sequelize.JSON,
          allowNull: true
        }
      )
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return Promise.all( [
    queryInterface.removeColumn('vouchers', 'product_attributes')

   ])
  }
};
