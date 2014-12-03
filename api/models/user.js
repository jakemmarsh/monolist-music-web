'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    username:         { type: DataTypes.STRING, unique: true, allowNull: false },
    role:             { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    email:            {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    imageUrl:         { type: DataTypes.STRING },
    password:         { type: DataTypes.STRING, allowNull: false },
    passwordResetKey: { type: DataTypes.STRING }
  },
  {
    hooks: {
      beforeValidate: function(user, model, cb) {
        if ( user.password ) {
          bcrypt.hash(user.password, 10, function(err, hash) {
            if ( err ) { throw err; }
            user.setDataValue('password', hash);
            cb(null, user);
          });
        }
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
      toJSON: function() {
        // Delete hash from object before sending to frontend
        var res = this.values;
        delete res.password;
        return res;
      },
      verifyPassword: function(password, cb) {
        bcrypt.compare(password, this.getDataValue('password'), cb);
      }
    }
  });

  return User;

};