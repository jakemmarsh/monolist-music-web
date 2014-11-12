'use strict';

module.exports = function(sequelize, DataTypes) {

  var Play = sequelize.define('Play', {},
  {
    methods: {
      associate: function(models) {
        Play.belongsTo(models.User);
        Play.belongsTo(models.Playlist);
      }
    }
  });

  return Play;

};