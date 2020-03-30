'use strict';
module.exports = (sequelize, DataTypes) => {
  const taxsettings = sequelize.define('taxsettings', {
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    hsn_code: DataTypes.STRING,
    is_activel: DataTypes.BOOLEAN
  }, {});
  taxsettings.associate = function(models) {
    // associations can be defined here
  };
  return taxsettings;
};