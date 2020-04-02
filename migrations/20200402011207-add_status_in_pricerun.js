'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'price_running_histories',
        'completed_product_count',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'price_running_histories',
        'is_completed',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
    
      queryInterface.addColumn(
        'price_running_histories',
        'completed_products',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }

      ),
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
