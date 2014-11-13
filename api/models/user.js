'use strict';

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email:    {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    imageUrl: { type: DataTypes.STRING },
    hash:     { type: DataTypes.STRING }
  },
  {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Playlist);
        User.hasMany(models.Collaboration);
      }
    },
    instanceMethods: {
      // Delete hash from object before sending to frontend
      toJSON: function() {
        var res = this.values;
        delete res.hash;
        return res;
      }
    }
  });

  return User;

};