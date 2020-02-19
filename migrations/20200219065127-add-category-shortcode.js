'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'master_product_categories',
        'short_code',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: true
        }
      )
      
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('master_product_categories', 'short_code')
   
      ]
  }
};
