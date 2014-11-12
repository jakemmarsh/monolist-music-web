'use strict';

module.exports = function(sequelize, DataTypes) {

  var Playlist = sequelize.define('Playlist', {
    title:    { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING },
    privacy:  { type: DataTypes.ENUM('public', 'private'), allowNull: false }
  },
  {
    classMethods: {
      associate: function(models) {
        Playlist.belongsTo(models.User);
        Playlist.hasMany(models.Collaboration);
        Playlist.hasMany(models.Track);
        Playlist.hasMany(models.Like);
        Playlist.hasMany(models.Play);
        Playlist.hasMany(models.Tag);
      }
    }
  });

  return Playlist;

};