'use strict';

var slug = require('slug');

module.exports = function(sequelize, DataTypes) {

  var Playlist = sequelize.define('Playlist', {
    title:    { type: DataTypes.STRING, allowNull: false },
    slug:     { type: DataTypes.STRING, allowNull: false, unique: true },
    imageUrl: { type: DataTypes.STRING },
    tags:     { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    privacy:  { type: DataTypes.ENUM('public', 'private'), defaultValue: 'public' }
  },
  {
    hooks: {
      beforeValidate: function(playlist, model, cb) {
        var titleSlug = slug(playlist.title).toLowerCase();

        Playlist.count({
          where: { slug: titleSlug }
        }).then(function(c) {
          if ( c > 0 ) {
            titleSlug += '-' + c;
          }
          playlist.setDataValue('slug', titleSlug);
          cb(null, playlist);
        });
      }
    },
    classMethods: {
      associate: function(models) {
        Playlist.belongsTo(models.User);
        Playlist.hasMany(models.Collaboration, { onDelete: 'cascade' });
        Playlist.hasMany(models.Track, { onDelete: 'cascade' });
        Playlist.hasMany(models.PlaylistLike, { as: 'Likes', onDelete: 'cascade' });
        Playlist.hasMany(models.PlaylistPlay, { as: 'Plays', onDelete: 'cascade' });
        Playlist.hasMany(models.PlaylistFollow, { as: 'Followers', foreignKey: 'PlaylistId', onDelete: 'cascade' });
      }
    }
  });

  return Playlist;

};