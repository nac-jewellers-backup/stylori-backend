'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Attribute_masters',
        'is_search',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all( [
      queryInterface.removeColumn('Attribute_masters', 'is_search')

     ])
  }
};
