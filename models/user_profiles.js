'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_profiles = sequelize.define('user_profiles', {
    user_id: DataTypes.UUID,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    otp: DataTypes.STRING,
    mobile: DataTypes.STRING,
    ismobileverified: DataTypes.BOOLEAN,
    isemailverified: DataTypes.BOOLEAN,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    pincode: DataTypes.STRING,
    islogin: DataTypes.BOOLEAN,
    lastlogin: DataTypes.DATE,
    status:{
      type: DataTypes.ENUM,
      values: ['Active','Inactive','Blocked']
    },
  }, {});
  user_profiles.associate = function(models) {
    // associations can be defined here
    // models.user_profiles.hasMany(models.user_address,{
    //   foreignKey: 'userprofile_id',
    //   targetKey: 'id'
    // });
  };
  return user_profiles;
};