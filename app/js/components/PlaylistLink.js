/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var Link         = React.createFactory(require('react-router').Link);

var PlaylistTags = require('./PlaylistTags');

var PlaylistLink = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object.isRequired
  },

  render: function() {
    var artworkStyle = {
      'backgroundImage': this.props.playlist.image ? 'url(' + this.props.playlist.image + ')' : 'none'
    };

    return (
      <div className="playlist-link" onClick={this.navigateToPlaylist}>

        <h5 className="title">{this.props.playlist.title}</h5>

        <div className="artwork" style={artworkStyle} />

        <div className="stats-container">
          <div className="play-count-container">
            <i className="fa fa-play"></i> {this.props.playlist.plays}
          </div>
          <div className="like-count-container">
            <i className="fa fa-heart"></i> {this.props.playlist.likes}
          </div>
        </div>

        <PlaylistTags tags={this.props.playlist.tags} />

        <Link to="Playlist" params={{ id: this.props.playlist.id }} />

      </div>
    );
  }

});

module.exports = React.createFactory(PlaylistLink);