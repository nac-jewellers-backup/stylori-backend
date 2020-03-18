'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'product_lists',
        'hsn_number',
        {
          type: Sequelize.STRING,
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
    queryInterface.removeColumn('product_lists', 'hsn_number')

   ])
  }
};
