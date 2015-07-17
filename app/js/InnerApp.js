'use strict';

import React                      from 'react/addons';
import {ListenerMixin}            from 'reflux';
import _                          from 'lodash';
import {RouteHandler, Navigation} from 'react-router';

import UserActions                from './actions/UserActions';
import GlobalActions              from './actions/GlobalActions';
import CurrentUserStore           from './stores/CurrentUserStore';
import CurrentPlaylistStore       from './stores/CurrentPlaylistStore';
import UserEditablePlaylistsStore from './stores/UserEditablePlaylistsStore';
import UserLikesStore             from './stores/UserLikesStore';
import Header                     from './components/Header';
import CurrentlyPlaying           from './components/CurrentlyPlaying';
import PlayerControlsMixin        from './mixins/PlayerControlsMixin';
import ContextMenuMixin           from './mixins/ContextMenuMixin';
import NavigationSidebar          from './components/NavigationSidebar';

var InnerApp = React.createClass({

  mixins: [Navigation, PlayerControlsMixin, ContextMenuMixin, ListenerMixin],

  propTypes: {
    activeRouteHandler: React.PropTypes.func
  },

  getInitialState() {
    return {
      currentPlaylist: {},
      currentUser: {},
      userCollaborations: [],
      userLikes: []
    };
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({
        currentUser: user
      }, () => {
        if ( !_.isEmpty(this.state.currentUser) ) {
          GlobalActions.loadUserEditablePlaylists();
          GlobalActions.loadUserLikes();
        }
      });
    }
  },

  _onPlaylistChange(playlist) {
    this.setState({ currentPlaylist: playlist });
  },

  _onUserEditablePlaylistsChange(userCollaborations) {
    this.setState({ userCollaborations: userCollaborations });
  },

  _onUserLikesChange(userLikes) {
    this.setState({ userLikes: userLikes });
  },

  componentDidMount() {
    if ( CurrentUserStore.user ) {
      this._onUserChange(null, CurrentUserStore.user);
    } else {
      UserActions.check(this._onUserChange);
    }

    this.listenTo(CurrentUserStore, this._onUserChange);
    this.listenTo(CurrentPlaylistStore, this._onPlaylistChange);
    this.listenTo(UserEditablePlaylistsStore, this._onUserEditablePlaylistsChange);
    this.listenTo(UserLikesStore, this._onUserLikesChange);
  },

  render() {
    return (
      <div>

        <Header currentUser={this.state.currentUser} showContextMenu={this.showContextMenu} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          audio={this.audio}
                          currentTrack={this.state.track}
                          paused={this.state.paused}
                          time={this.state.time}
                          duration={this.state.duration}
                          volume={this.state.volume}
                          repeat={this.state.repeat}
                          shuffle={this.state.shuffle}
                          nextTrack={this.nextTrack}
                          previousTrack={this.previousTrack}
                          togglePlay={this.togglePlay}
                          seekTrack={this.seekTrack}
                          updateVolume={this.updateVolume}
                          toggleRepeat={this.toggleRepeat}
                          toggleShuffle={this.toggleShuffle} />

        <div className="main-content-wrapper tall">
          <NavigationSidebar currentUser={this.state.currentUser} />
          <RouteHandler params={this.props.params}
                        query={this.props.query}
                        currentUser={this.state.currentUser}
                        userCollaborations={this.state.userCollaborations}
                        userLikes={this.state.userLikes}
                        currentTrack={this.state.track}
                        showContextMenu={this.showContextMenu} />
          <div className="shadow" />
        </div>

        {this.renderContextMenu()}

      </div>
    );
  }

});

export default InnerApp;