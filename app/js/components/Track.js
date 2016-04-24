'use strict';

import React              from 'react';
import _                  from 'lodash';
import {Link}             from 'react-router';
import cx                 from 'classnames';

import Helpers            from '../utils/Helpers';
import PermissionsHelpers from '../utils/PermissionsHelpers';
import PlaylistActions    from '../actions/PlaylistActions';
import TrackActions       from '../actions/TrackActions';
import GlobalActions      from '../actions/GlobalActions';
import CommentList        from './CommentList';

const Track = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    track: React.PropTypes.object,
    index: React.PropTypes.number,
    playlist: React.PropTypes.object,
    type: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    className: React.PropTypes.string,
    userCollaborations: React.PropTypes.array,
    removeTrackFromPlaylist: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
      userIsCreator: false,
      userIsCollaborator: false,
      track: {},
      playlist: {},
      isActive: false,
      userCollaborations: []
    };
  },

  getInitialState() {
    const hasUpvotesAndDownvotes = this.props.track.downvotes && this.props.track.upvotes;

    return {
      displayComments: false,
      isUpvoted: _.some(this.props.track.upvotes, { userId: this.props.currentUser.id }),
      isDownvoted: _.some(this.props.track.downvotes, { userId: this.props.currentUser.id }),
      score: hasUpvotesAndDownvotes ? this.props.track.upvotes.length - this.props.track.downvotes.length : 0,
      hasBeenAddedToPlaylist: false
    };
  },

  componentWillReceiveProps(nextProps) {
    const isNewTrack = !_.isEmpty(nextProps.track) && !_.isEqual(this.props.track, nextProps.track);
    const isNewUser = !_.isEmpty(nextProps.currentUser) && !_.isEqual(this.props.currentUser, nextProps.currentUser);
    const hasUpvotesAndDownvotes = nextProps.track.downvotes && nextProps.track.upvotes;

    if ( this.props.type === 'playlist' && (isNewTrack || isNewUser) ) {
      this.setState({
        isUpvoted: _.some(nextProps.track.upvotes, { userId: nextProps.currentUser.id }),
        isDownvoted: _.some(nextProps.track.downvotes, { userId: nextProps.currentUser.id }),
        score: hasUpvotesAndDownvotes ? nextProps.track.upvotes.length - nextProps.track.downvotes.length : 0
      });
    }
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  toggleCommentDisplay(evt) {
    evt.stopPropagation();

    this.setState({
      displayComments: !this.state.displayComments
    });
  },

  selectTrack() {
    PlaylistActions.play(
      this.props.playlist,
      TrackActions.select.bind(null, this.props.track, this.props.index, () => {})
    );
  },

  upvote(evt) {
    let newScore = this.state.score;

    evt.stopPropagation();

    if ( this.state.isUpvoted ) {
      newScore -= 1;
    } else if ( this.state.isDownvoted ) {
      newScore += 2;
    } else {
      newScore += 1;
    }

    this.setState({
      isUpvoted: !this.state.isUpvoted,
      isDownvoted: false,
      score: newScore
    }, TrackActions.upvote.bind(null, this.props.track));
  },

  downvote(evt) {
    let newScore = this.state.score;

    evt.stopPropagation();

    if ( this.state.isDownvoted ) {
      newScore += 1;
    } else if ( this.state.isUpvoted ) {
      newScore -= 2;
    } else {
      newScore -= 1;
    }

    this.setState({
      isDownvoted: !this.state.isDownvoted,
      isUpvoted: false,
      score: newScore
    }, TrackActions.downvote.bind(null, this.props.track));
  },

  showContextMenu(evt) {
    const menuItems = (
      <div>
        {this.renderStarTrackOption()}
        {this.renderAddTrackOption()}
        {this.renderGotoSourceOption()}
        {this.renderDeleteOption()}
      </div>
    );

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    GlobalActions.openContextMenu(menuItems, evt.pageX, evt.pageY);
  },

  postComment(body, cb = () => {}) {
    TrackActions.addComment(body, this.props.track, cb);
  },

  deleteComment(commentId, cb = () => {}) {
    TrackActions.removeComment(this.props.track.id, commentId, cb);
  },

  renderPossiblePlaylists() {
    return _.map(this.props.userCollaborations, (playlist, index) => {
      return (
        <li className="menu-item"
            key={index}
            onClick={PlaylistActions.addTrack.bind(null, playlist, this.props.track, () => {})}>
          {playlist.title}
        </li>
      );
    });
  },

  renderStarTrackOption() {
    const userHasStarred = !_.isEmpty(this.props.currentUser) && _.some(this.props.currentUser.starredTracks, {
      sourceParam: this.props.track.sourceParam,
      sourceUrl: this.props.track.sourceUrl
    });
    const iconClass = 'fa ' + (userHasStarred ? 'icon-star-o' : 'icon-star');
    const text = userHasStarred ? 'Unstar Track' : 'Star Track';
    const func = userHasStarred ? TrackActions.unstar : TrackActions.star;

    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <li className="menu-item" onClick={func.bind(null, this.props.track, () => {})}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }
  },

  renderAddTrackOption() {
    if ( !_.isEmpty(this.props.currentUser) && !!this.props.userCollaborations.length ) {
      return (
        <li className="menu-item">
          <i className="icon-plus" />
          Add Track To Playlist
          <i className="icon-chevron-right float-right flush--right" />
          <ul>
            {this.renderPossiblePlaylists(this.props.userCollaborations, this.props.track)}
          </ul>
        </li>
      );
    }
  },

  renderGotoSourceOption() {
    return (
      <li className="menu-item">
        <i className="icon-external-link" />
        Go to Source
        <a href={this.props.track.sourceUrl} target="_blank" />
      </li>
    );
  },

  renderDeleteOption() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser);
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.props.playlist, this.props.currentUser);

    if ( this.props.type === 'playlist' && this.props.removeTrackFromPlaylist && (userIsCollaborator || userIsCreator) ) {
      return (
        <li className="menu-item" onClick={this.props.removeTrackFromPlaylist.bind(null, this.props.track)}>
          <i className="icon-close"></i>
          Delete Track
        </li>
      );
    }
  },

  renderArtwork() {
    let artworkStyle;

    if ( this.props.track.imageUrl ) {
      artworkStyle = {
        'backgroundImage': 'url(' + this.props.track.imageUrl + ')'
      };

      return (
        <div className="artwork-container">
          <div className="artwork" style={artworkStyle} />
        </div>
      );
    }
  },

  renderDuration() {
    if ( this.props.track.duration ) {
      return (
        <span className="duration">{Helpers.formatSecondsAsTime(this.props.track.duration)}</span>
      );
    }
  },

  renderCollaboratorOptions() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser);
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.props.playlist, this.props.currentUser);
    const scoreClasses = cx({
      'score': true,
      'upvoted': this.state.isUpvoted,
      'downvoted': this.state.isDownvoted
    });
    const upvoteClasses = cx({
      'icon-chevron-up': true,
      'upvote': true,
      'active': this.state.isUpvoted
    });
    const downvoteClasses = cx({
      'icon-chevron-down': true,
      'downvote': true,
      'active': this.state.isDownvoted
    });

    if ( this.props.type === 'playlist' && (userIsCreator || userIsCollaborator) ) {
      return (
        <div className="upvote-downvote-container">
          <span className={scoreClasses}>{this.state.score}</span>
          <i ref="upvote" className={upvoteClasses} onClick={this.upvote} />
          <i ref="downvote" className={downvoteClasses} onClick={this.downvote} />
        </div>
      );
    }
  },

  renderTrackCreator() {
    if ( this.props.type === 'playlist' && this.props.track.user ) {
      return (
        <div className="added-by-container">
          added by <Link to={`/profile/${this.props.track.user.username}`} onClick={this.stopPropagation}>{this.props.track.user.username}</Link>
        </div>
      );
    }
  },

  renderTrackSource() {
    const elementClasses = 'source ' + this.props.track.source;

    return (
      <div className={elementClasses} />
    );
  },

  renderToggleCommentDisplay() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser);
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.props.playlist, this.props.currentUser);
    const numComments = this.props.track && this.props.track.comments ? this.props.track.comments.length : 0;
    const spanString = this.state.displayComments ? 'Hide Comments' : `Show Comments (${numComments})`;

    if ( this.props.type === 'playlist' && (userIsCreator || userIsCollaborator) ) {
      return (
        <a ref="commentToggle" className="inline-block nudge-quarter--top" onClick={this.toggleCommentDisplay}>{spanString}</a>
      );
    }
  },

  renderCommentList() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.props.playlist, this.props.currentUser);
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.props.playlist, this.props.currentUser);

    if( this.props.type === 'playlist' && (userIsCreator || userIsCollaborator) ) {
      return (
        <CommentList currentUser={this.props.currentUser}
                     postComment={this.postComment}
                     deleteComment={this.deleteComment}
                     comments={this.props.track.comments}
                     shouldDisplay={this.state.displayComments} />
      );
    }
  },

  render() {
    const classes = cx('track', {
      active: this.props.isActive,
      [this.props.className]: !!this.props.className
    });

    return (
      <li className={classes} onClick={this.selectTrack}>

        <div className="track-info-container">
          <div className="dropdown-icon-container">
            <i className="icon-ellipsis-h" onClick={this.showContextMenu} />
          </div>
          {this.renderArtwork()}
          <div className="info-container">
            <h5 className="title">{this.props.track.title} {this.renderDuration()}</h5>
            <h6 className="artist">{this.props.track.artist}</h6>
            {this.renderToggleCommentDisplay()}
          </div>
          <div className="options-container">
            {/*this.renderCollaboratorOptions()*/}
            {this.renderTrackCreator()}
          </div>
          {this.renderTrackSource()}
        </div>

        {this.renderCommentList()}

      </li>
    );
  }

});

export default Track;
