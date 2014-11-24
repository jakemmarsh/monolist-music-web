'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    role:     { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    email:    {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    imageUrl: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false }
  },
  {
    hooks: {
      beforeValidate: function(user, model, cb) {
        bcrypt.hash(user.password, 10, function(err, hash) {
          if ( err ) { throw err; }
          user.password = hash;
          cb(null, user);
        });
      }
    },
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Playlist);
        User.hasMany(models.Collaboration);
        User.hasMany(models.Like);
      }
    },
    instanceMethods: {
      // Delete hash from object before sending to frontend
      toJSON: function() {
        var res = this.values;
        delete res.hash;
        return res;
      },
      verifyPassword: function(password, cb) {
        bcrypt.compare(password, this.password, cb);
      }
    }
  });

  return User;

};