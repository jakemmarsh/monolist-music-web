/**
 * @jsx React.DOM
 */
'use strict';

var Routes             = require('react-router').Routes;
var Route              = require('react-router').Route;
var NotFoundRoute      = require('react-router').NotFoundRoute;
var DefaultRoute       = require('react-router').DefaultRoute;

var App                = require('./App');
var OuterApp           = require('./OuterApp');
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
var ForgotPasswordPage = require('./pages/ForgotPasswordPage');
var ResetPasswordPage  = require('./pages/ResetPasswordPage');
//var NotFoundPage       = require('./pages/NotFoundPage');

module.exports = (
  <Routes location='history'>

    <DefaultRoute handler={LoginPage} />

    <Route handler={App}>
      <Route name="Explore" path="/explore" handler={ExplorePage} />
      <Route name="TrackSearch" path="/tracks/search" handler={TrackSearchPage} />
      <Route name="Playlists" path="/playlists" handler={PlaylistsPage} />
      <Route name="PlaylistSearch" path="/playlists/search" handler={PlaylistSearchPage} />
      <Route name="Playlist" path="/playlist/:slug" handler={PlaylistPage} />
      <Route name="CreatePlaylist" path="/create" handler={CreatePlaylistPage} />
      <Route name="Profile" path="/profile/:username" handler={ProfilePage} />
      <Route name="Settings" path="/settings" handler={SettingsPage} />
    </Route>

    <Route handler={OuterApp}>
      <Route name="Login" path="/login" handler={LoginPage} />
      <Route name="Register" path="/register" handler={RegisterPage} />
      <Route name="ForgotPassword" path="/forgot" handler={ForgotPasswordPage} />
      <Route name="ResetPassword" path="/reset/:userId/:key" handler={ResetPasswordPage} />
      <NotFoundRoute handler={LoginPage} />
    </Route>

  </Routes>
);