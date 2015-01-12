/**
 * @jsx React.DOM
 */
'use strict';

var React                      = require('react/addons');
var Reflux                     = require('reflux');
var _                          = require('lodash');
var RouteHandler               = React.createFactory(require('react-router').RouteHandler);
var Navigation                 = require('react-router').Navigation;

var UserActions                = require('./actions/UserActions');
var GlobalActions              = require('./actions/GlobalActions');
var CurrentUserStore           = require('./stores/CurrentUserStore');
var CurrentPlaylistStore       = require('./stores/CurrentPlaylistStore');
var UserEditablePlaylistsStore = require('./stores/UserEditablePlaylistsStore');
var UserLikesStore             = require('./stores/UserLikesStore');
var Header                     = require('./components/Header');
var CurrentlyPlaying           = require('./components/CurrentlyPlaying');
var PlayerControlsMixin        = require('./mixins/PlayerControlsMixin');
var ContextMenuMixin           = require('./mixins/ContextMenuMixin');
var NavigationSidebar          = require('./components/NavigationSidebar');

var InnerApp = React.createClass({

  mixins: [Navigation, PlayerControlsMixin, ContextMenuMixin, Reflux.ListenerMixin],

  propTypes: {
    activeRouteHandler: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      currentPlaylist: {},
      currentUser: {},
      userCollaborations: [],
      userLikes: []
    };
  },

  _onUserChange: function(err, user) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({
        currentUser: user
      }, function() {
        if ( !_.isEmpty(this.state.currentUser) ) {
          GlobalActions.loadUserEditablePlaylists();
          GlobalActions.loadUserLikes();
        }
      }.bind(this));
    }
  },

  _onPlaylistChange: function(playlist) {
    this.setState({ currentPlaylist: playlist });
  },

  _onUserEditablePlaylistsChange: function(userCollaborations) {
    this.setState({ userCollaborations: userCollaborations });
  },

  _onUserLikesChange: function(userLikes) {
    this.setState({ userLikes: userLikes });
  },

  componentDidMount: function() {
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

  render: function() {
    return (
      <div>

        <Header currentUser={this.state.currentUser} showContextMenu={this.showContextMenu} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          currentTrack={this.state.track}
                          currentAudio={this.state.audio}
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
          <NavigationSidebar />
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

module.exports = React.createFactory(InnerApp);