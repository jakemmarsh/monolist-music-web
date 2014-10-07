/**
 * @jsx React.DOM
 */
'use strict';

var Routes             = require('react-router').Routes;
var Route              = require('react-router').Route;
var NotFoundRoute      = require('react-router').NotFoundRoute;
var App                = require('./App');
var ExplorePage        = require('./pages/ExplorePage');
var TrackSearchPage    = require('./pages/TrackSearchPage');
var PlaylistsPage      = require('./pages/PlaylistsPage');
var PlaylistSearchPage = require('./pages/PlaylistSearchPage');
var PlaylistPage       = require('./pages/PlaylistPage');
var ProfilePage        = require('./pages/ProfilePage');
var SettingsPage       = require('./pages/SettingsPage');
var NotFoundPage       = require('./pages/NotFoundPage');

module.exports = (
  <Routes location='history'>
    <Route path='/' handler={App}>
      <Route name='Explore' path='/' handler={ExplorePage} />
      <Route name='TrackSearch' path='/tracks/search' handler={TrackSearchPage} />
      <Route name='Playlists' path='/playlists' handler={PlaylistsPage} />
      <Route name='PlaylistSearch' path='/playlists/search' handler={PlaylistSearchPage} />
      <Route name='Playlist' path='/playlist/:id' handler={PlaylistPage} />
      <Route name='Profile' path='/user/:username' handler={ProfilePage} />
      <Route name='Settings' path='/settings' handler={SettingsPage} />
      <NotFoundRoute handler={NotFoundPage} />
    </Route>
  </Routes>
);