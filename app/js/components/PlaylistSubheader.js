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

const PlaylistSubheader = React.createClass({

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
        likes: [],
        plays: []
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

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) && !_.isEqual(this.props.playlist, nextProps.playlist) ) {
      this.setState({
        currentUserDoesLike: _.some(nextProps.playlist.likes, { userId: nextProps.currentUser.id }),
        numLikes: nextProps.playlist.likes ? nextProps.playlist.likes.length : 0,
        currentUserDoesFollow: _.some(nextProps.playlist.followers, { userId: nextProps.currentUser.id })
      });
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
                <i className="icon-heart entity-subheader-stat-icon" /> {this.state.numLikes}
              </span>
              <span>
                <i className="icon-play entity-subheader-stat-icon" /> {this.props.playlist.plays ? this.props.playlist.plays.length : 0}
              </span>
            </li>
          </ul>
          <TagList type="playlist" tags={this.props.playlist.tags} className="nudge-quarter--ends" />
        </div>
      );
    }
  },

  renderFollowButton() {
    const userCanFollow = PermissionsHelpers.userCanFollowPlaylist(this.props.playlist, this.props.currentUser);
    const classes = cx('btn', 'entity-subheader-action-button', {
      'active-yellow': this.state.currentUserDoesFollow
    });

    if ( userCanFollow ) {
      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowPlaylist}>
          <i className="icon-rss-square" />
        </div>
      );
    }
  },

  renderLikeButton() {
    const classes = cx('btn', 'entity-subheader-action-button', {
      'active-red': this.state.currentUserDoesLike
    });

    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div ref="likeButton" className={classes} onClick={this.toggleLikePlaylist}>
          <i className="icon-heart"></i>
        </div>
      );
    }
  },

  renderShareButton() {
    if ( !_.isEmpty(this.props.playlist) && this.props.playlist.privacy !== 'private' ) {
      return (
        <div ref="shareButton" className="btn entity-subheader-action-button" onClick={this.openShareModal}>
          <i className="icon-share-alt"></i>
        </div>
      );
    }
  },

  renderEditButton() {
    if ( PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser) ) {
      return (
        <div className="btn entity-subheader-action-button" onClick={this.openEditPlaylistModal.bind(null, this.props.playlist)}>
          <i className="icon-cog" />
        </div>
      );
    }
  },

  render() {
    return (
      <div className="entity-subheader playlist-subheader">

        {this.renderPlaylistImage()}

        <div className="entity-subheader-info-container">
          {this.renderPlaylistInfo()}
        </div>

        <div className="entity-subheader-actions-container text-right">
          <div className="entity-subheader-button-group">
            {this.renderFollowButton()}
            {this.renderLikeButton()}
            {this.renderShareButton()}
            {this.renderEditButton()}
          </div>
        </div>

      </div>
    );
  }

});

export default PlaylistSubheader;
