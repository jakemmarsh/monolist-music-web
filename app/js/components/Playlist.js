/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('underscore');

var cx    = React.addons.classSet;


var Playlist = React.createClass({

  renderTracks: function() {
    var tracks = null;
    var classes;

    if ( this.props.tracks ) {
      tracks = _.map(this.props.tracks, function(track, index) {
        classes = cx({
          'track': true,
          'active': this.props.currentTrack.id === track.id
        });

        return (
          <li className={classes} key={index} onClick={this.props.selectTrack.bind(this, track.id)}>
            <div className="artwork-container">
              <img src={track.image} className="artwork" />
            </div>
            <div className="info-container">
              <h5 className="title">{track.title} <span className="duration">3:43</span></h5>
              <h6 className="artist">{track.artist}</h6>
            </div>
            <div className="participant-container">
            </div>
          </li>
        );
      }.bind(this));
    }

    return tracks;
  },

  render: function() {
    return (
      <ul className="playlist">
        {this.renderTracks()}
      </ul>
    );
  }

});

module.exports = Playlist;