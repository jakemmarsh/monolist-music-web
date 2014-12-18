/**
 * @jsx React.DOM
 */
'use strict';

var React                      = require('react/addons');
var Reflux                     = require('reflux');
var Navigation                 = require('react-router').Navigation;

var UserActions                = require('./actions/UserActions');
var GlobalActions              = require('./actions/GlobalActions');
var CurrentUserStore           = require('./stores/CurrentUserStore');
var CurrentPlaylistStore       = require('./stores/CurrentPlaylistStore');
var UserEditablePlaylistsStore = require('./stores/UserEditablePlaylistsStore');
var Header                     = require('./components/Header');
var CurrentlyPlaying           = require('./components/CurrentlyPlaying');
var PlayerControlsMixin        = require('./mixins/PlayerControlsMixin');
var ContextMenuMixin           = require('./mixins/ContextMenuMixin');
var NavigationSidebar          = require('./components/NavigationSidebar');
var Footer                     = require('./components/Footer');
var HiddenYoutubePlayer        = require('./components/HiddenYoutubePlayer');

var App = React.createClass({

  mixins: [Navigation, PlayerControlsMixin, ContextMenuMixin, Reflux.ListenerMixin],

  propTypes: {
    activeRouteHandler: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      currentPlaylist: {},
      userPlaylists: [],
      currentUser: {}
    };
  },

  _onUserChange: function(user) {
    this.setState({
      currentUser: user || {}
    }, GlobalActions.loadUserEditablePlaylists(this._onUserEditablePlaylistsChange));
  },

  _onPlaylistChange: function(playlist) {
    this.setState({
      currentPlaylist: playlist
    });
  },

  _onUserEditablePlaylistsChange: function(userPlaylists) {
    this.setState({
      userCollaborations: userPlaylists
    });
  },

  componentDidMount: function() {
    UserActions.check(this._onUserChange);
    this.listenTo(CurrentUserStore, this._onUserChange);
    this.listenTo(CurrentPlaylistStore, this._onPlaylistChange);
    this.listenTo(UserEditablePlaylistsStore, this._onUserEditablePlaylistsChange);
  },

  render: function() {
    return (
      <div>

        <Header currentUser={this.state.currentUser} showContextMenu={this.showContextMenu} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          currentTrack={this.state.track}
                          currentAudio={this.state.audio}
                          currentTime={this.state.time}
                          isPaused={this.state.paused}
                          volume={this.state.volume}
                          repeat={this.state.repeat}
                          shuffle={this.state.shuffle}
                          nextTrack={this.nextTrack}
                          lastTrack={this.lastTrack}
                          togglePlay={this.togglePlay}
                          seekTrack={this.seekTrack}
                          updateVolume={this.updateVolume}
                          toggleRepeat={this.toggleRepeat}
                          toggleShuffle={this.toggleShuffle} />

        <div className="table-wrapper">
          <NavigationSidebar currentUser={this.state.currentUser} />
          <this.props.activeRouteHandler currentUser={this.state.currentUser}
                                         userCollaborations={this.state.userCollaborations}
                                         userPlaylists={this.state.userPlaylists}
                                         currentTrack={this.state.track}
                                         showContextMenu={this.showContextMenu} />

          <div className="shadow" />
        </div>

        {this.renderContextMenu()}

        <Footer />

        <HiddenYoutubePlayer createYouTubePlayer={this.createYouTubePlayer}
                             initializeYouTubePlayer={this.initializeYouTubePlayer}
                             youTubeListener={this.youTubeListener} />

      </div>
    );
  }

});

module.exports = React.createFactory(App);