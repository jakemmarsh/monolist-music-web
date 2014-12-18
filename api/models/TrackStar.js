'use strict';

module.exports = function(sequelize) {

  var TrackStar = sequelize.define('TrackStar', {},
  {
    methods: {
      associate: function(models) {
        TrackStar.belongsTo(models.User);
        TrackStar.belongsTo(models.Track, { as: 'Stars' });
      }
    }
  });

  return TrackStar;

};