'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'pricing_markups',
        'category',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'pricing_markups',
        'product_type',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
    queryInterface.removeColumn('pricing_markups', 'pricing_markups'),
    queryInterface.removeColumn('pricing_markups', 'product_type')
    ])
  }
};
