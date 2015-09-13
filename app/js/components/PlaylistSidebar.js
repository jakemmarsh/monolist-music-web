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

  toggleFollowPlaylist() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, PlaylistActions.follow.bind(null, this.props.playlist));
  },

  toggleLikePlaylist() {
    this.setState({
      currentUserDoesLike: !this.state.currentUserDoesLike,
      numLikes: this.state.currentUserDoesLike ? this.state.numLikes - 1 : this.state.numLikes + 1
    }, PlaylistActions.like.bind(null, this.props.playlist.id));
  },

  renderPlaylistCreator() {
    let hasPlaylistAndOwner = this.props.playlist && this.props.playlist.owner.id;
    let ownerIsUser = this.props.playlist.ownerType === 'user';
    let linkDestination = ownerIsUser ? '/profile/' : '/group/';
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
    let classes = cx({
      'action-button': true,
      'inactive': this.state.currentUserDoesLike
    });

    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div className={classes} onClick={this.toggleLikePlaylist}>
          <i className="icon-heart"></i>
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

    if ( !_.isEmpty(this.props.playlist) && !_.isEmpty(this.props.currentUser) && this.props.playlist.owner.id !== this.props.currentUser.id ) {
      return (
        <div className={classes} onClick={this.toggleFollowPlaylist}>
          {buttonText}
        </div>
      );
    }
  },

  renderShareButton() {
    let currentUserIsCreator = this.props.playlist.ownerId === this.props.currentUser.id && this.props.playlist.ownerType === 'user';
    let shouldDisplay = currentUserIsCreator || this.props.playlist.privacy !== 'private';

    if ( !_.isEmpty(this.props.playlist) && shouldDisplay ) {
      return (
        <div className="action-button" onClick={this.toggleShareModal}>
          <i className="icon-share-alt"></i>
        </div>
      );
    }
  },

  render() {
    let privacyIconClasses = cx({
      'fa': true,
      'icon-globe': this.props.playlist.privacy === 'public',
      'icon-lock': this.props.playlist.privacy === 'private'
    });
    let imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-sidebar soft--bottom">

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