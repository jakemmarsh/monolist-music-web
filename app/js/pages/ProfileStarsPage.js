'use strict';

import React           from 'react';
import _               from 'lodash';

import TrackActions    from '../actions/TrackActions';
import PlaylistActions from '../actions/PlaylistActions';
import GlobalActions   from '../actions/GlobalActions';
import Tracklist       from '../components/Tracklist';

var ProfileStarsPage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    user: React.PropTypes.object,
    showContextMenu: React.PropTypes.func
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
        <li className="menu-item" onClick={func.bind(null, track, function(){})}>
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
            onClick={PlaylistActions.addTrack.bind(null, playlist, track)}>
          {playlist.title}
        </li>
      );
    });
  },

  renderAddTrackOption(track) {
    let element = null;

    if ( !!this.props.userCollaborations.length ) {
      element = (
        <li className="menu-item">
          <i className="icon-plus" />
          Add Track To Playlist
          <i className="icon-chevron-right float-right flush--right" />
          <ul>
            {this.renderPossiblePlaylists(this.props.userCollaborations, track)}
          </ul>
        </li>
      );
    }

    return element;
  },

  showTrackContextMenu(evt, track) {
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

    GlobalActions.openContextMenu(evt, menuItems);
  },

  render() {
    if ( !_.isEmpty(this.props.user.starredTracks) ) {
      return (
        <Tracklist type="stars"
                   playlist={{ tracks: this.props.user.starredTracks }}
                   currentTrack={this.props.currentTrack}
                   showContextMenu={this.showTrackContextMenu}
                   currentUser={this.props.currentUser} />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">This user has not starred any tracks yet!</h4>
      );
    }
  }

});

export default ProfileStarsPage;