/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var _            = require('lodash');
var Link         = React.createFactory(require('react-router').Link);

var PlaylistTags = require('./PlaylistTags');

var PlaylistLink = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      playlist: {}
    };
  },

  renderTags: function() {
    var element = null;

    if ( !_.isEmpty(this.props.playlist.tags) ) {
      element = (
        <PlaylistTags className="nudge-quarter--ends" tags={this.props.playlist.tags} />
      );
    }

    return element;
  },

  render: function() {
    var imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-link" onClick={this.navigateToPlaylist}>

        <h5 className="title">{this.props.playlist.title}</h5>

        <div className="artwork" style={imageStyle} />

        <div className="stats-container nudge-quarter--bottom">
          <div className="play-count-container">
            <i className="fa fa-play"></i> {this.props.playlist.plays ? this.props.playlist.plays.length : 0}
          </div>
          <div className="like-count-container">
            <i className="fa fa-heart"></i> {this.props.playlist.likes ? this.props.playlist.likes.length : 0}
          </div>
        </div>

        {this.renderTags()}

        <Link to="Playlist" params={{ slug: this.props.playlist.slug }} />

      </div>
    );
  }

});

module.exports = React.createFactory(PlaylistLink);