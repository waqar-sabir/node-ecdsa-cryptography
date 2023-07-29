const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'user',
    {
      encrypted_data: {
        type: DataTypes.TEXT
      },
    },
  );
  return User;
};
