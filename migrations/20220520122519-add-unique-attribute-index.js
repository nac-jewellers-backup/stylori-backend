"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query(`ALTER TABLE IF EXISTS public.attributes ADD UNIQUE (name, master_id);`);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`SELECT 1;`);
  },
};
