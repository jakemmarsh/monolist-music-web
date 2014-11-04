/**
 * @jsx React.DOM
 */
 'use strict';

var React        = require('react/addons');

var PlaylistTags = require('./PlaylistTags');

var cx           = React.addons.classSet;

var PlaylistSidebar = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      userDoesLike: false // TODO: fix to be dynamic based on current user/playlist
    };
  },

  toggleLikePlaylist: function() {
    this.setState({
      userDoesLike: !this.state.userDoesLike
    }, function() {
      console.log('like playlist');
    });
  },

  sharePlaylist: function() {
    console.log('share playlist');
  },

  render: function() {
    var privacyIconClasses = cx({
      'fa': true,
      'fa-globe': this.props.playlist.privacy === 'public',
      'fa-lock': this.props.playlist.privacy === 'private'
    });
    var likeButtonClasses = cx({
      'action-button': true,
      active: this.state.userDoesLike
    });
    var imageStyle = {
      'backgroundImage': this.props.playlist.image ? 'url(' + this.props.playlist.image + ')' : 'none'
    };

    return (
      <div className="playlist-sidebar">

        <h4 className="playlist-title">
          {this.props.playlist.title}
          <i className={privacyIconClasses}></i>
        </h4>

        <div className="action-buttons-container">
          <div className={likeButtonClasses} onClick={this.toggleLikePlaylist}>
            <i className="fa fa-heart"></i>
          </div>
          <div className="action-button" onClick={this.sharePlaylist}>
            <i className="fa fa-share-alt"></i>
          </div>
        </div>

        <div className="playlist-image-container" style={imageStyle} />

        <div className="stats-container">
          <div className="play-count-container">
            <i className="fa fa-play"></i> {this.props.playlist.plays}
          </div>
          <div className="like-count-container">
            <i className="fa fa-heart"></i> {this.props.playlist.likes}
          </div>
        </div>

        <PlaylistTags tags={this.props.playlist.tags} />

        <div className="shadow" />

      </div>
    );
  }

});

module.exports = React.createFactory(PlaylistSidebar);