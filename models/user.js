'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Show, {
        as: "Favorites",
        through: "users_favorites"
    })
  };
  User.prototype.getFullName = function() {
      return `${this.first_name} ${this.last_name}`;
  };

  return User;
};