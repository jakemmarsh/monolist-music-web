/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react/addons');
var _         = require('underscore');

var SearchBar = require('./SearchBar');

var cx        = React.addons.classSet;


var Playlist = React.createClass({

  getInitialState: function() {
    return {
      query: ''
    };
  },

  updateQuery: function(evt) {
    this.setState({
      query: evt.target.value
    });
  },

  filterTracks: function(tracks, query) {
    return _.filter(tracks, function(track) {
      return track.title.toLowerCase().indexOf(query) !== -1 || track.artist.toLowerCase().indexOf(query) !== -1;
    });
  },

  renderTracks: function() {
    var trackElements = null;
    var filteredTracks = this.filterTracks(this.props.tracks, this.state.query);
    var classes;

    if ( filteredTracks ) {
      trackElements = _.map(filteredTracks, function(track, index) {
        classes = cx({
          'track': true,
          'active': this.props.currentTrack.id === track.id
        });

        return (
          <li className={classes} key={index} onClick={this.props.selectTrack.bind(null, track.id)}>
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

    return trackElements;
  },

  render: function() {
    return (
      <div>
        <div className="playlist-controls-container">
          <div className="options-container">
          </div>
          <div className="search-container">
            <SearchBar value={this.state.query}
                       onChange={this.updateQuery}
                       placeholder="Search playlist..." />
          </div>
        </div>
        <ul className="playlist">
          {this.renderTracks()}
        </ul>
      </div>
    );
  }

});

module.exports = Playlist;