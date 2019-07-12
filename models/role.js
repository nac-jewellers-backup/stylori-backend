'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
  	id: 
    {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: 
    {
    	type:DataTypes.STRING,
    	unique:true,
    	allowNull: false
    },
    isactive: {
    	type:DataTypes.BOOLEAN
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
         Role.belongsToMany(models.User, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
  };
  return Role;
};