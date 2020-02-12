'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return [
      queryInterface.addColumn(
        'trans_sku_descriptions',
        'certificate',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'trans_sku_descriptions',
        'ringsize_image',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ];
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return [
   queryInterface.removeColumn('trans_sku_descriptions', 'certificate'),
   queryInterface.removeColumn('trans_sku_descriptions', 'ringsize_image')

   ]
  }
};
