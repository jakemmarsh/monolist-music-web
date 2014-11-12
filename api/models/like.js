'use strict';

module.exports = function(sequelize, DataTypes) {

  var Like = sequelize.define('Like', {},
  {
    methods: {
      associate: function(models) {
        Like.belongsTo(models.User);
        Like.belongsTo(models.Playlist);
      }
    }
  });

  return Like;

};