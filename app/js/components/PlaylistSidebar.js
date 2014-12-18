/**
 * @jsx React.DOM
 */
 'use strict';

var React                 = require('react/addons');
var _                     = require('lodash');
var Link                  = React.createFactory(require('react-router').Link);
var cx                    = React.addons.classSet;

var PlaylistActions       = require('../actions/PlaylistActions');
var LayeredComponentMixin = require('../mixins/LayeredComponentMixin');
var PlaylistTags          = require('./PlaylistTags');
var Modal                 = require('./Modal');

var PlaylistSidebar = React.createClass({

  mixins: [LayeredComponentMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    playlist: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      playlist: {
        tags: [],
        likes: []
      }
    };
  },

  getInitialState: function() {
    return {
      isLiked: 0,
      numLikes: 0,
      showShareModal: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) ) {
      this.setState({
        isLiked: !!_.where(nextProps.playlist.likes, { userId: nextProps.currentUser.id }).length,
        numLikes: nextProps.playlist.likes ? nextProps.playlist.likes.length : 0
      });
    }
  },

  toggleLikePlaylist: function() {
    this.setState({
      isLiked: !this.state.isLiked,
      numLikes: this.state.isLiked ? this.state.numLikes - 1 : this.state.numLikes + 1
    }, PlaylistActions.like(this.props.playlist.id));
  },

  toggleShareModal: function() {
    this.setState({ showShareModal: !this.state.showShareModal });
  },

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showShareModal ) {
      element = (
        <Modal className="share-playlist" onRequestClose={this.toggleShareModal}>
          <h1>Hello!</h1>
        </Modal>
      );
    }

    return element;
  },

  renderPlaylistCreator: function() {
    var element = null;

    if ( this.props.playlist && this.props.playlist.user ) {
      element = (
        <div className="nudge-half--bottom">
          created by <Link to="Profile" params={{ username: this.props.playlist.user.username }}>{this.props.playlist.user.username}</Link>
        </div>
      );
    }

    return element;
  },

  renderLikeButton: function() {
    var element = null;
    var classes = cx({
      'action-button': true,
      active: this.state.isLiked
    });

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <div className={classes} onClick={this.toggleLikePlaylist}>
          <i className="fa fa-heart"></i>
        </div>
      );
    }

    return element;
  },

  render: function() {
    var privacyIconClasses = cx({
      'fa': true,
      'fa-globe': this.props.playlist.privacy === 'public',
      'fa-lock': this.props.playlist.privacy === 'private'
    });
    var imageStyle = {
      'backgroundImage': this.props.playlist.imageUrl ? 'url(' + this.props.playlist.imageUrl + ')' : 'none'
    };

    return (
      <div className="playlist-sidebar">

        <h4 className="playlist-title">
          {this.props.playlist.title}
          <i className={privacyIconClasses}></i>
        </h4>

        {this.renderPlaylistCreator()}

        <div className="action-buttons-container">
          {this.renderLikeButton()}
          <div className="action-button" onClick={this.toggleShareModal}>
            <i className="fa fa-share-alt"></i>
          </div>
        </div>

        <div className="playlist-image-container" style={imageStyle} />

        <div className="stats-container">
          <div className="play-count-container">
            <i className="fa fa-play"></i> {this.props.playlist.plays ? this.props.playlist.plays.length : 0}
          </div>
          <div className="like-count-container">
            <i className="fa fa-heart"></i> {this.state.numLikes}
          </div>
        </div>

        <PlaylistTags tags={this.props.playlist.tags} />

        <div className="shadow" />

      </div>
    );
  }

});

module.exports = React.createFactory(PlaylistSidebar);