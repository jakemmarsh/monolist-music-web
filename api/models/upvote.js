'use strict';

module.exports = function(sequelize) {

  var Upvote = sequelize.define('Upvote', {},
  {
    classMethods: {
      associate: function(models) {
        Upvote.belongsTo(models.User);
        Upvote.belongsTo(models.Track);
      }
    }
  });

  return Upvote;

};