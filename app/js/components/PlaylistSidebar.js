'use strict';

import React                  from 'react';
import _                      from 'lodash';
import {Link}                 from 'react-router';
import cx                     from 'classnames';

import PermissionsHelpers     from '../utils/PermissionsHelpers';
import ShareModalMixin        from '../mixins/ShareModalMixin';
import EditPlaylistModalMixin from '../mixins/EditPlaylistModalMixin';
import PlaylistActions        from '../actions/PlaylistActions';
import TagList                from './TagList';

var PlaylistSidebar = React.createClass({

  mixins: [ShareModalMixin, EditPlaylistModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    playlist: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      currentUser: {},
      playlist: {
        owner: {},
        tags: [],
        likes: []
      }
    };
  },

  getInitialState() {
    return {
      currentUserDoesLike: false,
      numLikes: 0,
      currentUserDoesFollow: false
    };
  },

  _handleFollowButtonHover() {
    this.refs.followButton.textContent = 'Unfollow';
  },

  _handleFollowButtonLeave() {
    this.refs.followButton.textContent = 'Following';
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) && !_.isEqual(this.props.playlist, nextProps.playlist) ) {
      this.setState({
        currentUserDoesLike: !!_.where(nextProps.playlist.likes, { userId: nextProps.currentUser.id }).length,
        numLikes: nextProps.playlist.likes ? nextProps.playlist.likes.length : 0,
        currentUserDoesFollow: !!_.where(nextProps.playlist.followers, { userId: nextProps.currentUser.id }).length
      });
    }
  },

  componentDidUpdate() {
    const followButton = this.refs.followButton;

    if ( followButton ) {
      if ( this.state.currentUserDoesFollow ) {
        followButton.addEventListener('mouseenter', this._handleFollowButtonHover);
        followButton.addEventListener('mouseleave', this._handleFollowButtonLeave);
      } else {
        followButton.removeEventListener('mouseenter', this._handleFollowButtonHover);
        followButton.removeEventListener('mouseleave', this._handleFollowButtonLeave);
      }
    }
  },

  setPrivacyLevel(newPrivacyLevel) {
    PlaylistActions.update(this.props.playlist.id, {
      privacy: newPrivacyLevel
    });
  },

  toggleFollowPlaylist() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, PlaylistActions.follow.bind(null, this.props.playlist));
  },

  toggleLikePlaylist() {
    this.setState({
      currentUserDoesLike: !this.state.currentUserDoesLike,
      numLikes: this.state.currentUserDoesLike ? this.state.numLikes - 1 : this.state.numLikes + 1
    }, PlaylistActions.like);
  },

  renderPlaylistCreator() {
    const hasPlaylistAndOwner = this.props.playlist && !_.isEmpty(this.props.playlist.owner);
    const ownerIsUser = this.props.playlist.ownerType === 'user';
    const linkDestination = ownerIsUser ? '/profile/' : '/group/';
    let destinationParam;
    let text;

    if ( hasPlaylistAndOwner ) {
      text = this.props.playlist.owner.username || this.props.playlist.owner.title;
      destinationParam = ownerIsUser ? this.props.playlist.owner.username : this.props.playlist.owner.slug;

      return (
        <div className="nudge-half--bottom">
          created by <Link to={`${linkDestination}${destinationParam}`}>{text}</Link>
        </div>
      );
    }
  },

  renderLikeButton() {
    const classes = cx({
      'action-button': true,
      'inactive': this.state.currentUserDoesLike
    });

    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div ref="likeButton" className={classes} onClick={this.toggleLikePlaylist}>
          <i className="icon-heart"></i>
        </div>
      );
    }
  },

  renderFollowButton() {
    const userCanFollow = PermissionsHelpers.userCanFollowPlaylist(this.props.playlist, this.props.currentUser);
    const buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    const classes = cx({
      'action-button': true,
      'follow-button': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( userCanFollow ) {
      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowPlaylist}>
          {buttonText}
        </div>
      );
    }
  },

  renderShareButton() {
    if ( !_.isEmpty(this.props.playlist) && this.props.playlist.privacy !== 'private' ) {
      return (
        <div ref="shareButton" className="action-button" onClick={this.openShareModal}>
          <i className="icon-share-alt"></i>
        </div>
      );
    }
  },

  renderEditButton() {
    if ( PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser) ) {
      return (
        <a href={null} onClick={this.openEditPlaylistModal.bind(null, this.props.playlist)} className="epsilon edit-link">
          <i className="icon-cog" />
        </a>
      );
    }
  },

  render() {
    const privacyIconClasses = cx({
      'icon-globe': this.props.playlist.privacy === 'public',
      'icon-lock': this.props.playlist.privacy === 'private'
    });
    let imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-sidebar soft--bottom">

        {this.renderEditButton()}

        <h4 className="title flush--top nudge-quarter--bottom nudge-quarter--right">
          <i className={privacyIconClasses} />
          {this.props.playlist.title}
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
            <i className="icon-play"></i> {this.props.playlist.plays ? this.props.playlist.plays.length : 0}
          </div>
          <div className="like-count-container">
            <i className="icon-heart"></i> {this.state.numLikes}
          </div>
        </div>

        <TagList type="playlist" tags={this.props.playlist.tags} />

        <div className="shadow" />

      </div>
    );
  }

});

export default PlaylistSidebar;