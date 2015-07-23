'use strict';

import React                                from 'react/addons';
import {Route, NotFoundRoute, DefaultRoute} from 'react-router';

import GlobalApp                            from './GlobalApp';
import InnerApp                             from './InnerApp';
import OuterApp                             from './OuterApp';
import RegisterPage                         from './pages/RegisterPage';
import LoginPage                            from './pages/LoginPage';
import ExplorePage                          from './pages/ExplorePage';
import TrackSearchPage                      from './pages/TrackSearchPage';
import PlaylistsPage                        from './pages/PlaylistsPage';
import PlaylistSearchPage                   from './pages/PlaylistSearchPage';
import PlaylistPage                         from './pages/PlaylistPage';
import GroupPage                            from './pages/GroupPage';
import GroupsPage                           from './pages/GroupsPage';
import CreateGroupPage                      from './pages/CreateGroupPage';
import CreatePlaylistPage                   from './pages/CreatePlaylistPage';
import ProfilePage                          from './pages/ProfilePage';
import SettingsPage                         from './pages/SettingsPage';
import ForgotPasswordPage                   from './pages/ForgotPasswordPage';
import ResetPasswordPage                    from './pages/ResetPasswordPage';
import NotFoundPage                         from './pages/NotFoundPage';

export default (
  <Route handler={GlobalApp}>

    <DefaultRoute handler={ExplorePage} />

    <Route handler={InnerApp}>
      <Route name="Explore" path="/" handler={ExplorePage} />
      <Route name="TrackSearch" path="/tracks/search" handler={TrackSearchPage} />
      <Route name="Playlists" path="/playlists" handler={PlaylistsPage} />
      <Route name="PlaylistSearch" path="/playlists/search" handler={PlaylistSearchPage} />
      <Route name="Playlist" path="/playlist/:owner/:slug" handler={PlaylistPage} />
      <Route name="Group" path="/group/:slug" handler={GroupPage} />
      <Route name="Groups" path="/groups" handler={GroupsPage} />
      <Route name="CreateGroup" path="/group/create" handler={CreateGroupPage} />
      <Route name="CreatePlaylist" path="/playlist/create" handler={CreatePlaylistPage} />
      <Route name="Profile" path="/profile/:username" handler={ProfilePage} />
      <Route name="Settings" path="/settings" handler={SettingsPage} />
    </Route>

    <Route handler={OuterApp}>
      <Route name="Login" path="/login" handler={LoginPage} />
      <Route name="Register" path="/register" handler={RegisterPage} />
      <Route name="ForgotPassword" path="/forgot" handler={ForgotPasswordPage} />
      <Route name="ResetPassword" path="/reset/:userId/:key" handler={ResetPasswordPage} />
    </Route>

    <NotFoundRoute handler={NotFoundPage} />

  </Route>
);