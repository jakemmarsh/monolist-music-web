'use strict';

import React                                from 'react/addons';
import {Route, NotFoundRoute, DefaultRoute} from 'react-router';

import GlobalApp                            from './GlobalApp';
import InnerApp                             from './InnerApp';
import OuterApp                             from './OuterApp';
import RegisterPage                         from './pages/RegisterPage';
import LoginPage                            from './pages/LoginPage';
import ExplorePage                          from './pages/ExplorePage';
import SearchPage                           from './pages/SearchPage';
import TrackSearchPage                      from './pages/TrackSearchPage';
import GroupSearchPage                      from './pages/GroupSearchPage';
import PlaylistsPage                        from './pages/PlaylistsPage';
import PlaylistSearchPage                   from './pages/PlaylistSearchPage';
import PlaylistPage                         from './pages/PlaylistPage';
import GroupPage                            from './pages/GroupPage';
import GroupFeedPage                        from './pages/GroupFeedPage';
import GroupPlaylistsPage                   from './pages/GroupPlaylistsPage';
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
      <Route name="Search" path="/search" handler={SearchPage}>
        <Route name="PlaylistSearch" path="/search/playlists" handler={PlaylistSearchPage} />
        <Route name="TrackSearch" path="/search/tracks" handler={TrackSearchPage} />
        <Route name="GroupSearch" path="/search/groups" handler={GroupSearchPage} />
      </Route>
      <Route name="Playlists" path="/playlists" handler={PlaylistsPage} />
      <Route name="CreatePlaylist" path="/playlists/create" handler={CreatePlaylistPage} />
      <Route name="Playlist" path="/playlist/:slug" handler={PlaylistPage} />
      <Route path="/group" handler={GroupPage}>
        <Route name="Group" path="/group/:slug" handler={GroupFeedPage} />
        <Route name="GroupPlaylists" path="/group/:slug/playlists" handler={GroupPlaylistsPage} />
      </Route>
      <Route name="Groups" path="/groups" handler={GroupsPage} />
      <Route name="CreateGroup" path="/groups/create" handler={CreateGroupPage} />
      <Route name="Profile" path="/profile/:username" handler={ProfilePage} />
      <Route name="Settings" path="/settings" handler={SettingsPage} />
    </Route>

    <Route handler={OuterApp}>
      <Route name="Login" path="/login" handler={LoginPage} />
      <Route name="Register" path="/register" handler={RegisterPage} />
      <Route name="ForgotPassword" path="/forgot" handler={ForgotPasswordPage} />
      <Route name="ResetPassword" path="/reset/:userId/:key" handler={ResetPasswordPage} />
      <NotFoundRoute handler={NotFoundPage} />
    </Route>

  </Route>
);