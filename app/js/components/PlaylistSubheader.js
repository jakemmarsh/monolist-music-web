'use strict';

import React              from 'react';
import _                  from 'lodash';
import {Link, History}    from 'react-router';
import cx                 from 'classnames';

import Modals             from '../utils/Modals';
import PermissionsHelpers from '../utils/PermissionsHelpers';
import PlaylistActions    from '../actions/PlaylistActions';
import TagList            from './TagList';
import ActionButton       from './ActionButton';

const PlaylistSubheader = React.createClass({

  mixins: [History],

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
        likes: [],
        plays: []
      }
    };
  },

  currentUserDoesLike() {
    return !_.isEmpty(this.props.currentUser) && _.some(this.props.playlist.likes, { userId: this.props.currentUser.id });
  },

  currentUserDoesFollow() {
    return !_.isEmpty(this.props.currentUser) && _.some(this.props.playlist.followers, { userId: this.props.currentUser.id });
  },

  selectUser(user) {
    PlaylistActions.addCollaborator(this.props.playlist, user);
  },

  deselectUser(user) {
    PlaylistActions.removeCollaborator(this.props.playlist, user);
  },

  isUserSelected(user) {
    return PermissionsHelpers.isUserPlaylistCollaborator(this.props.playlist, user);
  },

  quitCollaborating() {
    this.deselectUser(this.props.currentUser);
  },

  deletePlaylist() {
    PlaylistActions.delete(this.props.playlist, () => {
      this.history.pushState(null, `/profile/${this.props.currentUser.username}/playlists`);
    });
  },

  renderPlaylistImage() {
    if ( this.props.playlist.imageUrl ) {
      const imageStyles = {
        backgroundImage: `url(${this.props.playlist.imageUrl})`
      };

      return (
        <div className="entity-subheader-image-container">
          <div className="entity-subheader-image" style={imageStyles} />
        </div>
      );
    }
  },

  renderPlaylistCreatorLink() {
    const ownerIsUser = this.props.playlist.ownerType === 'user';
    const text = this.props.playlist.owner.username || this.props.playlist.owner.title;
    const destinationParam = ownerIsUser ? this.props.playlist.owner.username : this.props.playlist.owner.slug;
    const linkDestination = ownerIsUser ? '/profile/' : '/group/';

    return (
      <Link to={`${linkDestination}${destinationParam}`}>{text}</Link>
    );
  },

  renderPlaylistInfo() {
    if ( this.props.playlist.id ) {
      const numLikes = this.props.playlist.likeCount || 0;
      const numPlays = this.props.playlist.playCount || 0;
      const privacyIconClasses = cx('entity-subheader-privacy-icon', 'delta', {
        'icon-globe': this.props.playlist.privacy === 'public',
        'icon-lock': this.props.playlist.privacy === 'private'
      });

      return (
        <div>
          <h1 className="entity-subheader-title">
            {this.props.playlist.title}
            <i className={privacyIconClasses} />
          </h1>
          <ul className="entity-subheader-stats">
            <li className="entity-subheader-stat-item">
              created by {this.renderPlaylistCreatorLink()}
            </li>
            <li className="entity-subheader-stat-item">
              <span className="nudge-quarter--right">
                <i className="icon-play entity-subheader-stat-icon" /> {numPlays}
              </span>
              <span>
                <i className="icon-heart entity-subheader-stat-icon" /> {numLikes}
              </span>
            </li>
          </ul>
          <TagList type="playlist" tags={this.props.playlist.tags} className="nudge-quarter--bottom" />
        </div>
      );
    }
  },

  renderManageCollaboratorsButton() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser);

    if ( userIsCreator ) {
      const clickHandler = Modals.openUserSearch.bind(
        null,
        this.props.playlist.collaborators,
        this.props.currentUser,
        this.selectUser,
        this.deselectUser,
        this.isUserSelected
      );

      return (
        <ActionButton ref="manageCollaboratorsButton"
                      onClick={clickHandler}
                      icon="group"
                      tooltip="Manage Collaborators" />
      );
    }
  },

  renderAddTrackFromUrlButton() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser);
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.props.playlist, this.props.currentUser);

    if ( userIsCreator || userIsCollaborator ) {
      const clickHandler = Modals.openAddTrackByUrl.bind(null, this.props.playlist, this.props.currentUser);

      return (
        <ActionButton ref="addTrackFromUrlButton"
                      onClick={clickHandler}
                      icon="plus"
                      tooltip="Add Track from URL" />
      );
    }
  },

  renderFollowButton() {
    const userCanFollow = PermissionsHelpers.userCanFollowPlaylist(this.props.playlist, this.props.currentUser);
    const currentUserDoesFollow = this.currentUserDoesFollow();
    const classes = cx({
      'active-yellow': currentUserDoesFollow
    });
    const tooltip = currentUserDoesFollow ? 'Unfollow' : 'Follow';

    if ( !_.isEmpty(this.props.currentUser) && userCanFollow ) {
      return (
        <ActionButton ref="followButton"
                      className={classes}
                      onClick={PlaylistActions.follow}
                      icon="rss-square"
                      tooltip={tooltip} />
      );
    }
  },

  renderLikeButton() {
    const currentUserDoesLike = this.currentUserDoesLike();
    const classes = cx({
      'active-red': currentUserDoesLike
    });
    const tooltip = currentUserDoesLike ? 'Unlike' : 'Like';

    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <ActionButton ref="likeButton"
                      className={classes}
                      onClick={PlaylistActions.like}
                      icon="heart"
                      tooltip={tooltip} />
      );
    }
  },

  renderShareButton() {
    if ( !_.isEmpty(this.props.playlist) && this.props.playlist.privacy !== 'private' ) {
      const clickHandler = Modals.openShare.bind(null, this.props.playlist);

      return (
        <ActionButton ref="shareButton"
                      onClick={clickHandler}
                      icon="share-alt"
                      tooltip="Share" />
      );
    }
  },

  renderEditButton() {
    if ( PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser) ) {
      const clickHandler = Modals.openEditPlaylist.bind(null, this.props.playlist);

      return (
        <ActionButton ref="editButton"
                      onClick={clickHandler}
                      icon="edit"
                      tooltip="Edit" />
      );
    }
  },

  renderQuitCollaboratingButton() {
    const isOwnedByGroup = this.props.playlist.ownerType === 'group';
    const isGroupOwner = isOwnedByGroup && this.props.playlist.owner.id === this.props.currentUser.id;
    const isGroupMember = isOwnedByGroup && _.some(this.props.playlist.owner.memberships, { userId: this.props.currentUser.id });
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.props.playlist, this.props.currentUser);

    if ( !isGroupMember && !isGroupOwner && userIsCollaborator ) {
      return (
        <ActionButton ref="quitCollaboratingButton"
                      onClick={this.quitCollaborating}
                      icon="user-times"
                      tooltip="Quit Collaborating" />
      );
    }
  },

  renderDeleteButton() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser);

    if ( userIsCreator ) {
      const clickHandler = Modals.openConfirmation.bind(
        null,
        'Are you sure you want to delete this playlist?',
        this.deletePlaylist
      );

      return (
        <ActionButton ref="deleteButton"
                      onClick={clickHandler}
                      icon="close"
                      tooltip="Delete" />
      );
    }
  },

  renderActionButtons() {
    if ( this.props.playlist.id ) {
      return (
        <div className="entity-subheader-button-group">
          {this.renderManageCollaboratorsButton()}
          {this.renderAddTrackFromUrlButton()}
          {this.renderFollowButton()}
          {this.renderLikeButton()}
          {this.renderShareButton()}
          {this.renderEditButton()}
          {this.renderQuitCollaboratingButton()}
          {this.renderDeleteButton()}
        </div>
      );
    }
  },

  render() {
    return (
      <div className="entity-subheader playlist-subheader">
        <div className="max-width-wrapper d-f ai-c">
          {this.renderPlaylistImage()}

          <div className="entity-subheader-info-container">
            {this.renderPlaylistInfo()}
          </div>

          <div className="entity-subheader-actions-container text-right">
            {this.renderActionButtons()}
          </div>
        </div>
      </div>
    );
  }

});

export default PlaylistSubheader;
