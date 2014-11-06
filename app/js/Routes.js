/**
 * @jsx React.DOM
 */
'use strict';

var Routes             = require('react-router').Routes;
var Route              = require('react-router').Route;
var NotFoundRoute      = require('react-router').NotFoundRoute;
var DefaultRoute       = require('react-router').DefaultRoute;

var App                = require('./App');
var HomePage           = require('./pages/HomePage');
var RegisterPage       = require('./pages/RegisterPage');
var LoginPage          = require('./pages/LoginPage');
var ExplorePage        = require('./pages/ExplorePage');
var TrackSearchPage    = require('./pages/TrackSearchPage');
var PlaylistsPage      = require('./pages/PlaylistsPage');
var PlaylistSearchPage = require('./pages/PlaylistSearchPage');
var PlaylistPage       = require('./pages/PlaylistPage');
var CreatePlaylistPage = require('./pages/CreatePlaylistPage');
var ProfilePage        = require('./pages/ProfilePage');
var SettingsPage       = require('./pages/SettingsPage');
var NotFoundPage       = require('./pages/NotFoundPage');

module.exports = (
  <Routes location='history'>

    <DefaultRoute handler={HomePage} />

    <Route name='Home' path='/' handler={HomePage} />
    <Route name='Register' path='/register' handler={RegisterPage} />
    <Route name='Login' path='/login' handler={LoginPage} />

    <Route handler={App}>
      <Route name='Explore' path='/explore' handler={ExplorePage} />
      <Route name='TrackSearch' path='/tracks/search' handler={TrackSearchPage} />
      <Route name='Playlists' path='/playlists' handler={PlaylistsPage} />
      <Route name='PlaylistSearch' path='/playlists/search' handler={PlaylistSearchPage} />
      <Route name='Playlist' path='/playlist/:id' handler={PlaylistPage} />
      <Route name='CreatePlaylist' path='/create' handler={CreatePlaylistPage} />
      <Route name='Profile' path='/user/:username' handler={ProfilePage} />
      <Route name='Settings' path='/settings' handler={SettingsPage} />
      <NotFoundRoute handler={NotFoundPage} />
    </Route>

  </Routes>
);