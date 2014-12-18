'use strict';

module.exports = function(sequelize, DataTypes) {

  var Track = sequelize.define('Track', {
    title:       { type: DataTypes.STRING, allowNull: false },
    artist:      { type: DataTypes.STRING },
    source:      { type: DataTypes.ENUM('soundcloud', 'bandcamp', 'youtube', 'spotify'), allowNull: false },
    sourceParam: { type: DataTypes.STRING, allowNull: false },
    sourceUrl:   {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    imageUrl:    { type: DataTypes.STRING }
  },
  {
    classMethods: {
      associate: function(models) {
        Track.belongsTo(models.User);
        Track.belongsTo(models.Playlist);
        Track.hasMany(models.TrackDownvote, { onDelete: 'cascade' });
        Track.hasMany(models.TrackUpvote, { onDelete: 'cascade' });
        Track.hasMany(models.TrackComment, { onDelete: 'cascade' });
        Track.hasMany(models.TrackPlay, { onDelete: 'cascade' });
      }
    }
  });

  return Track;

};