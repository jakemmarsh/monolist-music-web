'use strict';

var React        = require('react/addons');
var _            = require('lodash');
var Link         = require('react-router').Link;

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
    var backgroundStyle = {};

    if ( this.props.playlist.imageUrl ) {
      backgroundStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-group-link" style={backgroundStyle}>

        <div className="top-container">
          <h5 className="title">{this.props.playlist.title}</h5>

          <div className="stats-container">
            <div className="play-count-container">
              <i className="fa fa-play"></i> {this.props.playlist.plays ? this.props.playlist.plays.length : 0}
            </div>
            <div className="like-count-container">
              <i className="fa fa-heart"></i> {this.props.playlist.likes ? this.props.playlist.likes.length : 0}
            </div>
          </div>

          <Link to="Playlist" params={{ owner: this.props.playlist.owner, slug: this.props.playlist.slug }} />
        </div>

        {this.renderTags()}

        <Link to="Playlist"
              params={{ owner: this.props.playlist.owner, slug: this.props.playlist.slug }}
              className="go-button">
          <i className="fa fa-angle-right" />
        </Link>

      </div>
    );
  }

});

module.exports = PlaylistLink;