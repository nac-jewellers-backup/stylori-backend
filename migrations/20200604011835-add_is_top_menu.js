'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Attribute_masters',
        'is_top_menu',
        {
          type: Sequelize.BOOLEAN,
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
    queryInterface.removeColumn('Attribute_masters', 'is_top_menu')

   ])
  }
};
