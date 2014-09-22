/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react/addons');
var _         = require('underscore');
var $         = require('jquery');

var SearchBar = require('./SearchBar');
var Track     = require('./Track');

var Playlist = React.createClass({

  getInitialState: function() {
    return {
      query: ''
    };
  },

  componentDidMount: function() {
    var $thisElement = $(this.getDOMNode());

    // Set minimum height to prevent page jump on filter
    $thisElement.css({
      'min-height': $thisElement.height()
    });
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

    if ( filteredTracks ) {
      trackElements = _.map(filteredTracks, function(track, index) {
        return (
          <Track track={track}
                 isActive={this.props.currentTrack.id === track.id}
                 selectTrack={this.props.selectTrack}
                 key={index} />
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