'use strict';

import React           from 'react';
import _               from 'lodash';
import cx              from 'classnames';
import {Link}          from 'react-router';

import PlaylistActions from '../actions/PlaylistActions';
import TrackActions    from '../actions/TrackActions';
import GlobalActions   from '../actions/GlobalActions';

const MiniTrack = React.createClass({
  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    userCollaborations: React.PropTypes.array.isRequired,
    playlist: React.PropTypes.object.isRequired,
    track: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    type: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool,
    className: React.PropTypes.string
  },

  selectTrack() {
    PlaylistActions.play(
      this.props.playlist,
      TrackActions.select.bind(null, this.props.track, this.props.index)
    );
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  showContextMenu(evt) {
    evt.stopPropagation();

    const menuItems = (
      <div>
        {this.renderStarTrackOption()}
        {/*this.renderAddTrackOption() TODO: make this work */}
        {this.renderGotoSourceOption()}
      </div>
    );

    GlobalActions.openContextMenu(menuItems, evt.pageX, evt.pageY);
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

  renderDraggableIcon() {
    const isDraggable = false; // TODO: remove this

    if ( isDraggable ) {
      return (
        <div className="mini-track-draggable-container soft-half--ends text-center">
          <i className="mini-track-draggable-icon icon-bars" />
        </div>
      );
    }
  },

  renderTrackInfo() {
    let uploaderElement;

    if ( this.props.type === 'playlist' && this.props.track.user ) {
      uploaderElement = (
        <span className="mini-track-uploader">
          added by
          <Link ref="uploaderLink" to={`/profile/${this.props.track.user.username}`} onClick={this.stopPropagation}>
             {` ${this.props.track.user.username}`}
          </Link>
        </span>
      );
    }

    return (
      <div className="mini-track-info-container soft-half--ends soft-quarter--sides fx-4">
        <h6 ref="trackTitle" className="mini-track-title flush--ends">{this.props.track.title}</h6>
        {uploaderElement}
      </div>
    );
  },

  renderMenuToggle() {
    return (
      <div className="mini-track-menu-toggle-container soft-half--ends text-center">
        <i ref="menuToggle" className="mini-track-menu-icon icon-ellipsis-h" onClick={this.showContextMenu} />
      </div>
    );
  },

  render() {
    const classes = cx('mini-track', 'd-f', 'fxd-r', 'ai-c', {
      active: this.props.isActive,
      [this.props.track.source]: true,
      [this.props.className]: !!this.props.className
    });

    return (
      <li className={classes} onClick={this.selectTrack}>
        {this.renderDraggableIcon()}
        {this.renderTrackInfo()}
        {this.renderMenuToggle()}
      </li>
    );
  }
});

export default MiniTrack;
