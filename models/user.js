'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  	id: 
    {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    userName: 
    {
    	type:DataTypes.STRING,
    	unique:true,
    	allowNull: false
    },
    email: 
    {
    	type:DataTypes.STRING,
    	unique:true,
    	allowNull: false
    },
    password: {
    	type: DataTypes.STRING
    },
    isVerified:{
      type: DataTypes.BOOLEAN
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
  User.associate = function(models) {
    // associations can be defined here
    
    User.belongsToMany(models.Role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});
    User.hasOne(models.VerificationToken, {
      as: 'VerificationToken',
      foreignKey: 'userId',
      foreignKeyConstraint: true,
    });
  };
  return User;
};