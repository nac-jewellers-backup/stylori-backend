'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
     
      queryInterface.addColumn(
        'master_product_categories',
        'short_code',
        {
          type: Sequelize.TEXT,
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
    queryInterface.removeColumn('master_product_categories', 'short_code')

   ])
  }
};
