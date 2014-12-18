'use strict';

module.exports = function(sequelize, DataTypes) {

  var PlaylistTag = sequelize.define('PlaylistTag', {
    title: { type: DataTypes.STRING, unqiue: true, allowNull: false }
  },
  {
    methods: {
      associate: function(models) {
        PlaylistTag.hasMany(models.Playlist);
      }
    }
  });

  return PlaylistTag;

};