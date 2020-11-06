'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'seo_url_priorities',
        'image_url',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'seo_url_priorities',
        'mobile_image_url',
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
    queryInterface.removeColumn('seo_url_priorities', 'image_url'),
    queryInterface.removeColumn('seo_url_priorities', 'mobile_image_url')

   ])
  }
};
