'use strict';

module.exports = function(sequelize) {

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