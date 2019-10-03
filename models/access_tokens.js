'use strict';
module.exports = (sequelize, DataTypes) => {
  const access_tokens = sequelize.define('access_tokens', {
    user_id: DataTypes.UUID,
    access_token: DataTypes.STRING
  }, {
    schema:'auth'
  });
  access_tokens.associate = function(models) {
    // associations can be defined here
    models.access_tokens.belongsTo(models.users,{
      foreignKey: 'user_id',
      targetKey: 'id'
    });
  };
  return access_tokens;
};