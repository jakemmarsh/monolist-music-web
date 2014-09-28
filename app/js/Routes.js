/**
 * @jsx React.DOM
 */
'use strict';

var Routes        = require('react-router').Routes;
var Route         = require('react-router').Route;
var NotFoundRoute = require('react-router').NotFoundRoute;
var App           = require('./App');
var HomePage      = require('./pages/HomePage');
var ExplorePage   = require('./pages/ExplorePage');
var SearchPage    = require('./pages/SearchPage');
var PlaylistsPage = require('./pages/PlaylistsPage');
var PlaylistPage  = require('./pages/PlaylistPage');
var UserPage      = require('./pages/UserPage');
var NotFoundPage  = require('./pages/NotFoundPage');

module.exports = (
  <Routes location='history'>
    <Route path='/' handler={App}>
      <Route name='home' path='/' handler={HomePage} />
      <Route name='explore' path='/explore' handler={ExplorePage} />
      <Route name='search' path='/search' handler={SearchPage} />
      <Route name='playlists' path='/playlists' handler={PlaylistsPage} />
      <Route name='playlist' path='/playlist/:id' handler={PlaylistPage} />
      <Route name='user' path='/user/:username' handler={UserPage} />
      <NotFoundRoute handler={NotFoundPage} />
    </Route>
  </Routes>
);