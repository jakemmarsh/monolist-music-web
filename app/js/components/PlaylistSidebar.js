'use strict';

import React                from 'react';
import _                    from 'lodash';
import $                    from 'jquery';
import {Link}               from 'react-router';
import cx                   from 'classnames';

import ShareModalMixin      from '../mixins/ShareModalMixin';
import PlaylistActions      from '../actions/PlaylistActions';
import PrivacyLevelDropdown from './PrivacyLevelDropdown';
import PlaylistTags         from './PlaylistTags';

var PlaylistSidebar = React.createClass({

  mixins: [ShareModalMixin],

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

  handleTitleInputKeydown(evt) {
    const isEnterKey = evt.keyCode === 13;

    if ( isEnterKey ) {
      evt.target.blur();
    }
  },

  handleTitleInputBlur(evt) {
    const newTitle = evt.target.value;

    if ( newTitle !== this.props.playlist.title ) {
      PlaylistActions.update(this.props.playlist.id, {
        title: newTitle
      });
    }
  },

  isUserCreator() {
    return this.props.playlist.owner.id === this.props.currentUser.id && this.props.playlist.ownerType === 'user';
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

  renderPlaylistTitle() {
    const dropdown = (
      <PrivacyLevelDropdown privacyLevel={this.props.playlist.privacy}
                            setPrivacyLevel={this.setPrivacyLevel}
                            userCanChange={this.isUserCreator()} />
    );
    let element;

    if ( this.isUserCreator() ) {
      element = (
        <div className="nudge-quarter--bottom table full-width">
          <div className="td">
            {dropdown}
          </div>
          <div className="td">
            <input type="text" className="title-input" defaultValue={this.props.playlist.title} onKeyDown={this.handleTitleInputKeydown} onBlur={this.handleTitleInputBlur} />
          </div>
        </div>
      );
    } else {
      element = (
        <h4 className="title flush--top nudge-quarter--bottom">
          {dropdown}
          {this.props.playlist.title}
        </h4>
      );
    }

    return element;
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
    const buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    const classes = cx({
      'action-button': true,
      'follow-button': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.playlist) && !_.isEmpty(this.props.currentUser) && this.props.playlist.owner.id !== this.props.currentUser.id ) {
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
        <div ref="shareButton" className="action-button" onClick={this.toggleShareModal}>
          <i className="icon-share-alt"></i>
        </div>
      );
    }
  },

  render() {
    let imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-sidebar soft--bottom">

        {this.renderPlaylistTitle()}

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

        <PlaylistTags tags={this.props.playlist.tags} />

        <div className="shadow" />

      </div>
    );
  }

});

export default PlaylistSidebar;