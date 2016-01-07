'use strict';

import React           from 'react';
import _               from 'lodash';
import {Link}          from 'react-router';
import cx              from 'classnames';

import Helpers         from '../utils/Helpers';
import PlaylistActions from '../actions/PlaylistActions';
import TrackActions    from '../actions/TrackActions';
import CommentList     from './CommentList';

var Track = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userIsCreator: React.PropTypes.bool,
    userIsCollaborator: React.PropTypes.bool,
    track: React.PropTypes.object,
    index: React.PropTypes.number,
    playlist: React.PropTypes.object,
    type: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    showContextMenu: React.PropTypes.func,
    shouldRenderAddButton: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      currentUser: {},
      userIsCreator: false,
      userIsCollaborator: false,
      track: {},
      playlist: {},
      isActive: false,
      showContextMenu: function() {},
      shouldRenderAddButton: false
    };
  },

  getInitialState() {
    return {
      displayComments: false,
      isUpvoted: false,
      isDownvoted: false,
      score: 0,
      hasBeenAddedToPlaylist: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( this.props.type === 'playlist' && !_.isEmpty(nextProps.track) && !_.isEqual(this.props.track, nextProps.track) ) {
      this.setState({
        isUpvoted: !!_.where(nextProps.track.upvotes, { userId: nextProps.currentUser.id }).length,
        isDownvoted: !!_.where(nextProps.track.downvotes, { userId: nextProps.currentUser.id }).length,
        score: nextProps.track.upvotes.length - nextProps.track.downvotes.length
      });
    }
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
    this.props.showContextMenu(evt, this.props.track);
  },

  addToPlaylist(evt) {
    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    PlaylistActions.addTrack(this.props.playlist, this.props.track, () => {
      this.setState({ hasBeenAddedToPlaylist: true });
    });
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  postComment(body, cb = () => {}) {
    TrackActions.addComment(body, this.props.track, cb);
  },

  deleteComment(commentId, cb = () => {}) {
    TrackActions.removeComment(this.props.track.id, commentId, cb);
  },

  renderDropdownToggle() {
    const iconClasses = cx({
      'fa': true,
      'icon-check': this.state.hasBeenAddedToPlaylist,
      'icon-plus': !this.state.hasBeenAddedToPlaylist && this.props.shouldRenderAddButton,
      'icon-ellipsis-h': !this.state.hasBeenAddedToPlaylist && !this.props.shouldRenderAddButton
    });
    let clickFunc;

    if ( !this.state.hasBeenAddedToPlaylist && this.props.shouldRenderAddButton ) {
      clickFunc = this.addToPlaylist;
    } else if ( !this.state.hasBeenAddedToPlaylist && !this.props.shouldRenderAddButton ) {
      clickFunc = this.showContextMenu;
    } else {
      clickFunc = this.stopPropagation;
    }

    if ( !_.isEmpty(this.props.currentUser) && this.props.type !== 'post' ) {
      return (
        <div className="dropdown-icon-container">
          <i className={iconClasses} onClick={clickFunc} />
        </div>
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
    const scoreClasses = cx({
      'score': true,
      'upvoted': this.state.isUpvoted,
      'downvoted': this.state.isDownvoted
    });
    const upvoteClasses = cx({
      'fa': true,
      'icon-chevron-up': true,
      'upvote': true,
      'active': this.state.isUpvoted
    });
    const downvoteClasses = cx({
      'fa': true,
      'icon-chevron-down': true,
      'downvote': true,
      'active': this.state.isDownvoted
    });

    if ( this.props.type === 'playlist' && (this.props.userIsCreator || this.props.userIsCollaborator) ) {
      return (
        <div className="upvote-downvote-container">
          <span className={scoreClasses}>{this.state.score}</span>
          <i ref="upvote" className={upvoteClasses} onClick={this.upvote}></i>
          <i ref="downvote" className={downvoteClasses} onClick={this.downvote}></i>
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
    let iconClasses = 'fa icon-' + this.props.track.source;

    if ( this.props.track.source === 'youtube' ) {
      iconClasses += '-play';
    }

    return (
      <div className={elementClasses}>
        <i className={iconClasses}></i>
        <a href={this.props.track.sourceUrl} target="_blank" />
      </div>
    );
  },

  renderToggleCommentDisplay() {
    const numComments = this.props.track && this.props.track.comments ? this.props.track.comments.length : 0;
    const spanString = this.state.displayComments ? 'Hide Comments' : `Show Comments (${numComments})`;

    if ( this.props.type === 'playlist' && (this.props.userIsCreator || this.props.userIsCollaborator) ) {
      return (
        <a ref="commentToggle" className="inline-block nudge-quarter--top" onClick={this.toggleCommentDisplay}>{spanString}</a>
      );
    }
  },

  renderCommentList() {
    if( this.props.type === 'playlist' && (this.props.userIsCreator || this.props.userIsCollaborator) ) {
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
    let classes = {
      'track': true,
      'active': this.props.isActive
    };

    if ( this.props.className ) {
      classes[this.props.className] = true;
    }

    classes = cx(classes);

    return (
      <li className={classes} onClick={this.selectTrack}>

        <div className="track-info-container">
          {this.renderDropdownToggle()}
          {this.renderArtwork()}
          <div className="info-container">
            <h5 className="title">{this.props.track.title} {this.renderDuration()}</h5>
            <h6 className="artist">{this.props.track.artist}</h6>
            {this.renderToggleCommentDisplay()}
          </div>
          <div className="options-container">
            {this.renderCollaboratorOptions()}
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