'use strict';

module.exports = function(sequelize, DataTypes) {

  var Tag = sequelize.define('Tag', {
    title: { type: DataTypes.STRING, unqiue: true, allowNull: false }
  },
  {
    methods: {
      associate: function(models) {
        Tag.hasMany(models.Playlist);
      }
    }
  });

  return Tag;

};