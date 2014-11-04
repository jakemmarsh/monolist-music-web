/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var Reflux                  = require('reflux');

var GlobalActions           = require('./actions/GlobalActions');
var UserActions             = require('./actions/UserActions');
var CurrentUserStore        = require('./stores/CurrentUserStore');
var CurrentPlaylistStore    = require('./stores/CurrentPlaylistStore');
var UserCollaborationsStore = require('./stores/UserCollaborationsStore');
var Header                  = require('./components/Header');
var CurrentlyPlaying        = require('./components/CurrentlyPlaying');
var PlayerControlsMixin     = require('./mixins/PlayerControlsMixin');
var ContextMenuMixin        = require('./mixins/ContextMenuMixin');
var NavigationSidebar       = require('./components/NavigationSidebar');
var Footer                  = require('./components/Footer');

var App = React.createClass({

  mixins: [PlayerControlsMixin, ContextMenuMixin, Reflux.ListenerMixin],

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
    }, GlobalActions.loadUserCollaborations(this._onUserCollaborationsChange));
  },

  _onPlaylistChange: function(playlist) {
    this.setState({
      currentPlaylist: playlist
    });
  },

  _onUserCollaborationsChange: function(userPlaylists) {
    this.setState({
      userPlaylists: userPlaylists
    });
  },

  componentWillMount: function() {
    // TODO: don't hardcode user login info
    UserActions.login('jakemmarsh', '');
  },

  componentDidMount: function() {
    this.listenTo(CurrentUserStore, this._onUserChange);
    this.listenTo(CurrentPlaylistStore, this._onPlaylistChange);
    this.listenTo(UserCollaborationsStore, this._onUserCollaborationsChange);
  },

  updatePageTitle: function(title) {
    var newPageTitle = '';

    if ( title ) {
      newPageTitle += title;
      newPageTitle += ' \u2014 ';
    }

    newPageTitle += 'Monolist';

    document.title = newPageTitle;
  },

  render: function() {
    return (
      <div>

        <Header title={this.state.title}
                icon={this.state.icon} />

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