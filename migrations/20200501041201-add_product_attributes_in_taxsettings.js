'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'master_tax_settings',
        'product_attributes',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_tax_settings',
        'display_attributes',
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
  }
};
