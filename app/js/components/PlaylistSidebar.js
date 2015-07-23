'use strict';

import React           from 'react/addons';
import _               from 'lodash';
import $               from 'jquery';
import {Link}          from 'react-router';
import cx              from 'classnames';

import ShareModalMixin from '../mixins/ShareModalMixin';
import PlaylistActions from '../actions/PlaylistActions';
import PlaylistTags    from './PlaylistTags';

var PlaylistSidebar = React.createClass({

  mixins: [ShareModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    playlist: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      currentUser: {},
      playlist: {
        tags: [],
        likes: []
      }
    };
  },

  getInitialState() {
    return {
      isLiked: 0,
      numLikes: 0,
      currentUserDoesFollow: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) && !_.isEqual(this.props.playlist, nextProps.playlist) ) {
      this.setState({
        isLiked: !!_.where(nextProps.playlist.likes, { userId: nextProps.currentUser.id }).length,
        numLikes: nextProps.playlist.likes ? nextProps.playlist.likes.length : 0,
        currentUserDoesFollow: !!_.where(nextProps.playlist.followers, { userId: nextProps.currentUser.id }).length
      });
    }
  },

  componentDidUpdate() {
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

  toggleFollowPlaylist() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, PlaylistActions.follow.bind(null, this.props.playlist));
  },

  toggleLikePlaylist() {
    this.setState({
      isLiked: !this.state.isLiked,
      numLikes: this.state.isLiked ? this.state.numLikes - 1 : this.state.numLikes + 1
    }, PlaylistActions.like.bind(null, this.props.playlist.id));
  },

  renderPlaylistCreator() {
    let ownerIsUser = this.props.playlist.ownerType === 'user';
    let linkDestination = ownerIsUser ? 'Profile' : 'Group';
    let params = {};
    let destinationParam;
    let text;

    if ( this.props.playlist && !_.isUndefined(this.props.playlist.id) ) {
      text = ownerIsUser ? this.props.playlist.user.username : this.props.playlist.group.title;
      destinationParam = ownerIsUser ? this.props.playlist.user.username : this.props.playlist.group.slug;
      params[ownerIsUser ? 'username' : 'slug'] = destinationParam;

      return (
        <div className="nudge-half--bottom">
          created by <Link to={linkDestination} params={params}>{text}</Link>
        </div>
      );
    }
  },

  renderLikeButton() {
    let classes = cx({
      'action-button': true,
      'inactive': this.state.isLiked
    });

    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div className={classes} onClick={this.toggleLikePlaylist}>
          <i className="fa fa-heart"></i>
        </div>
      );
    }
  },

  renderFollowButton() {
    let buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    let classes = cx({
      'action-button': true,
      'follow-button': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.playlist) && !_.isEmpty(this.props.currentUser) && this.props.playlist.user.id !== this.props.currentUser.id ) {
      return (
        <div className={classes} onClick={this.toggleFollowPlaylist}>
          {buttonText}
        </div>
      );
    }
  },

  renderShareButton() {
    let currentUserIsCreator = this.props.playlist.userId === this.props.currentUser.id;
    let shouldDisplay = currentUserIsCreator || this.props.playlist.privacy !== 'private';

    if ( !_.isEmpty(this.props.playlist) && shouldDisplay ) {
      return (
        <div className="action-button" onClick={this.toggleShareModal}>
          <i className="fa fa-share-alt"></i>
        </div>
      );
    }
  },

  render() {
    let privacyIconClasses = cx({
      'fa': true,
      'fa-globe': this.props.playlist.privacy === 'public',
      'fa-lock': this.props.playlist.privacy === 'private'
    });
    let imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-group-sidebar">

        <h4 className="title flush--top nudge-quarter--bottom">
          {this.props.playlist.title}
          <i className={privacyIconClasses}></i>
        </h4>

        {this.renderPlaylistCreator()}

        <div className="action-buttons-container">
          {this.renderLikeButton()}
          {this.renderFollowButton()}
          {this.renderShareButton()}
        </div>

        <div className="image-container" style={imageStyle} />

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

export default PlaylistSidebar;