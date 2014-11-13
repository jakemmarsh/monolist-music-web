'use strict';

module.exports = function(sequelize) {

  var Downvote = sequelize.define('Downvote', {},
  {
    classMethods: {
      associate: function(models) {
        Downvote.belongsTo(models.User);
        Downvote.belongsTo(models.Track);
      }
    }
  });

  return Downvote;

};