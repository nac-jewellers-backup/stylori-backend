'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_profiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        type: Sequelize.UUID,
        references: {  model:{ schema: 'auth', tableName: 'users' }, key: "id" }
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      ismobileverified: {
        type: Sequelize.BOOLEAN
      },
      isemailverified: {
        type: Sequelize.BOOLEAN
      },
      country_code: {
        type: Sequelize.STRING
      },
      salutation: {
        type: Sequelize.STRING
      },
    
      address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.STRING
      },
      islogin: {
        type: Sequelize.BOOLEAN
      },
      lastlogin: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Active','Inactive','Blocked'],
        defaultValue: 'Active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_profiles');
  }
};