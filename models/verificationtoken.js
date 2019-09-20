'use strict';
module.exports = (sequelize, DataTypes) => {
  const VerificationToken = sequelize.define('VerificationToken', {
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    tokentype: {
      type: DataTypes.INTEGER,
      defaultvalue: 1,
      allowNull: false
    }
  }, {});
  VerificationToken.associate = function(models) {
    // associations can be defined here
    // VerificationToken.belongsTo(models.User, {
    //   as: "user",
    //   foreignKey: "userId",
    //   foreignKeyConstraint: true
    // });
    
  };
  return VerificationToken;
};