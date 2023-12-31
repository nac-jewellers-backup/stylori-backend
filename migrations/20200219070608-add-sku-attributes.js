'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'trans_sku_lists',
        'attributes',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
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
   return Promise.all([ 
    queryInterface.removeColumn('trans_sku_lists', 'attributes')
 
    ])
  }
};
