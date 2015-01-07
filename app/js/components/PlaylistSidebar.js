/**
 * @jsx React.DOM
 */
 'use strict';

var React           = require('react/addons');
var _               = require('lodash');
var $               = require('jquery');
var Link            = React.createFactory(require('react-router').Link);
var cx              = React.addons.classSet;

var ShareModalMixin = require('../mixins/ShareModalMixin');
var PlaylistActions = require('../actions/PlaylistActions');
var PlaylistTags    = require('./PlaylistTags');

var PlaylistSidebar = React.createClass({

  mixins: [ShareModalMixin],

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
      currentUserDoesFollow: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) && !_.isEqual(this.props.playlist, nextProps.playlist) ) {
      this.setState({
        isLiked: !!_.where(nextProps.playlist.likes, { userId: nextProps.currentUser.id }).length,
        numLikes: nextProps.playlist.likes ? nextProps.playlist.likes.length : 0,
        currentUserDoesFollow: !!_.where(nextProps.playlist.followers, { userId: nextProps.currentUser.id }).length
      });
    }
  },

  componentDidUpdate: function() {
    if ( this.state.currentUserDoesFollow ) {
      $('.follow-button.inactive').hover(function() {
        $(this).text('Unfollow');
      });

      $('.follow-button.inactive').mouseleave(function() {
        $(this).text('Following');
      });
    } else {
      $('.follow-button').unbind('mouseenter mouseleave');
    }
  },

  toggleFollowPlaylist: function() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, PlaylistActions.follow(this.props.playlist));
  },

  toggleLikePlaylist: function() {
    this.setState({
      isLiked: !this.state.isLiked,
      numLikes: this.state.isLiked ? this.state.numLikes - 1 : this.state.numLikes + 1
    }, PlaylistActions.like(this.props.playlist.id));
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
      'inactive': this.state.isLiked
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

  renderFollowButton: function() {
    var element = null;
    var buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    var classes = cx({
      'action-button': true,
      'follow-button': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.playlist) && !_.isEmpty(this.props.currentUser) && this.props.playlist.user.id !== this.props.currentUser.id ) {
      element = (
        <div className={classes} onClick={this.toggleFollowPlaylist}>
          {buttonText}
        </div>
      );
    }

    return element;
  },

  renderShareButton: function() {
    var element = null;
    var currentUserIsCreator = this.props.playlist.userId === this.props.currentUser.id;
    var shouldDisplay = currentUserIsCreator || this.props.playlist.privacy !== 'private';

    if ( !_.isEmpty(this.props.playlist) && shouldDisplay ) {
      element = (
        <div className="action-button" onClick={this.toggleShareModal}>
          <i className="fa fa-share-alt"></i>
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
    var imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-sidebar">

        <h4 className="playlist-title flush--top nudge-quarter--bottom">
          {this.props.playlist.title}
          <i className={privacyIconClasses}></i>
        </h4>

        {this.renderPlaylistCreator()}

        <div className="action-buttons-container">
          {this.renderLikeButton()}
          {this.renderFollowButton()}
          {/*this.renderShareButton()*/}
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