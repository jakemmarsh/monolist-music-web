/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var Reflux                  = require('reflux');
var Navigation              = require('react-router').Navigation;

var GlobalActions           = require('./actions/GlobalActions');
var CurrentUserStore        = require('./stores/CurrentUserStore');
var CurrentPlaylistStore    = require('./stores/CurrentPlaylistStore');
var UserCollaborationsStore = require('./stores/UserCollaborationsStore');
var Header                  = require('./components/Header');
var CurrentlyPlaying        = require('./components/CurrentlyPlaying');
var PlayerControlsMixin     = require('./mixins/PlayerControlsMixin');
var PageTitleMixin          = require('./mixins/PageTitleMixin');
var ContextMenuMixin        = require('./mixins/ContextMenuMixin');
var NavigationSidebar       = require('./components/NavigationSidebar');
var Footer                  = require('./components/Footer');

var App = React.createClass({

  mixins: [Navigation, PageTitleMixin, PlayerControlsMixin, ContextMenuMixin, Reflux.ListenerMixin],

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
      currentUser: user
    }, function() {
      // TODO: figure out why this callback isn't being called
      if ( this.state.currentUser === null ) {
        this.transitionTo('Home');
      } else {
        GlobalActions.loadUserCollaborations(this._onUserCollaborationsChange);
      }
    });
  },

  _onPlaylistChange: function(playlist) {
    this.setState({
      currentPlaylist: playlist
    });
  },

  _onUserCollaborationsChange: function(userPlaylists) {
    this.setState({
      userCollaborations: userPlaylists
    });
  },

  componentDidMount: function() {
    if ( CurrentUserStore.user === null ) {
      this.transitionTo('Login');
    } else {
      this.setState({
        currentUser: CurrentUserStore.user
      }, GlobalActions.loadUserCollaborations(this._onUserCollaborationsChange));
      this.listenTo(CurrentUserStore, this._onUserChange);
      this.listenTo(CurrentPlaylistStore, this._onPlaylistChange);
      this.listenTo(UserCollaborationsStore, this._onUserCollaborationsChange);
    }
  },

  render: function() {
    return (
      <div>

        <Header currentUser={this.state.currentUser} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          currentTrack={this.state.track}
                          currentAudio={this.state.audio}
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
          <NavigationSidebar />
          <this.props.activeRouteHandler currentUser={this.state.currentUser}
                                         userCollaborations={this.state.userCollaborations}
                                         updatePageTitle={this.updatePageTitle}
                                         userPlaylists={this.state.userPlaylists}
                                         currentTrack={this.state.track}
                                         showContextMenu={this.showContextMenu} />

          <div className="shadow" />
        </div>

        {this.renderContextMenu()}

        <Footer />

      </div>
    );
  }

});

module.exports = React.createFactory(App);