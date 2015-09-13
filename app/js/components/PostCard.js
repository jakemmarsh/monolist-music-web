'use strict';

import React           from 'react/addons';
import _               from 'lodash';
import moment          from 'moment';
import {Link}          from 'react-router';
import Linkify         from 'react-linkify';

import PostActions     from '../actions/PostActions';
import PlaylistActions from '../actions/PlaylistActions';
import TrackActions    from '../actions/TrackActions';
import Avatar          from './Avatar';
import Track           from './Track';
import CommentList     from './CommentList';

var PostCard = React.createClass({

  propTypes: {
    post: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    trackIndex: React.PropTypes.number,
    playlist: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    showContextMenu: React.PropTypes.func,
    deletePost: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      post: {},
      currentUser: {},
      trackIndex: 0,
      playlist: {},
      userCollaborations: [],
      showContextMenu: function() {},
      deletePost: function() {}
    };
  },

  getInitialState() {
    return {
      displayComments: true
    };
  },

  postComment(body, cb = () => {}) {
    PostActions.addComment(this.props.post.id, body, cb);
  },

  deleteComment(commentId, cb = () => {}) {
    PostActions.removeComment(this.props.post.id, commentId, cb);
  },

  trackIsActive: function() {
    let postTrack = this.props.post.track;

    return this.props.currentTrack && this.props.currentTrack.sourceParam === postTrack.sourceParam;
  },

  renderStarTrackOption(track) {
    let userHasStarred = !_.isEmpty(this.props.currentUser) && !!_.where(this.props.currentUser.starredTracks, {
      sourceParam: track.sourceParam,
      sourceUrl: track.sourceUrl
    }).length;
    let iconClass = 'fa ' + (userHasStarred ? 'icon-star-o' : 'icon-star');
    let text = userHasStarred ? 'Unstar Track' : 'Star Track';
    let func = userHasStarred ? TrackActions.unstar : TrackActions.star;
    let element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li className="menu-item" onClick={func.bind(null, track, () => {})}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }

    return element;
  },

  renderPossiblePlaylists(playlists, track) {
    return _.map(playlists, (playlist, index) => {
      return (
        <li className="menu-item"
            key={index}
            onClick={PlaylistActions.addTrack.bind(null, playlist, track, () => {})}>
          {playlist.title}
        </li>
      );
    });
  },

  renderAddTrackOption(track) {
    let element = null;

    if ( this.props.userCollaborations.length ) {
      element = (
        <li className="menu-item">
          <i className="icon-plus" />
          Add Track To Playlist
          <ul>
            {this.renderPossiblePlaylists(this.props.userCollaborations, track)}
          </ul>
        </li>
      );
    }

    return element;
  },

  showContextMenu(evt, track) {
    let menuItems = (
      <div>
        {this.renderStarTrackOption(track)}
        {this.renderAddTrackOption(track)}
      </div>
    );

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    this.props.showContextMenu(evt, menuItems);
  },

  renderDeleteButton() {
    if ( this.props.post.user.id === this.props.currentUser.id || this.props.currentUser.role === 'admin' ) {
      return (
        <i className="icon-remove delete-button"
           onClick={this.props.deletePost.bind(null, this.props.post.id)} />
      );
    }
  },

  renderTrack() {
    if ( this.props.post && this.props.post.track ) {
      return (
        <ul className="nudge-quarter--bottom">
          <Track type="post"
                 track={this.props.post.track}
                 index={this.props.trackIndex}
                 playlist={this.props.playlist}
                 currentUser={this.props.currentUser}
                 showContextMenu={this.showContextMenu}
                 isActive={this.trackIsActive()} />
        </ul>
      );
    }
  },

  render() {
    return (
      <div className="post-card islet nudge-half--bottom">

        <div className="user-info-container table full-width">
          <div className="td avatar-container">
            <Avatar user={this.props.post.user} size={50} />
          </div>
          <div className="td name-container soft-half--sides">
            <Link to={`/profile/${this.props.post.user.username}`}>
              {this.props.post.user.username}
            </Link>
          </div>
          <div className="td timestamp text-right">
            {this.renderDeleteButton()}
            {moment(this.props.post.createdAt).fromNow()}
          </div>
        </div>

        <div className="body islet">
          <Linkify properties={{ 'target': '_blank' }}>
            {this.props.post.body}
          </Linkify>
        </div>

        {this.renderTrack()}

        <CommentList currentUser={this.props.currentUser}
                     postComment={this.postComment}
                     deleteComment={this.deleteComment}
                     comments={this.props.post.comments}
                     shouldDisplay={this.state.displayComments} />

      </div>
    );
  }

});

export default PostCard;