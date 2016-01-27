'use strict';

import React                     from 'react';
import {
  Route,
  Redirect,
  IndexRoute
} from 'react-router';

import GlobalApp                 from './GlobalApp';
import InnerApp                  from './InnerApp';
import OuterApp                  from './OuterApp';
import RegisterPage              from './pages/RegisterPage';
import LoginPage                 from './pages/LoginPage';
import SearchPage                from './pages/SearchPage';
import TrackSearchPage           from './pages/TrackSearchPage';
import GroupSearchPage           from './pages/GroupSearchPage';
import PlaylistsPage             from './pages/PlaylistsPage';
import PlaylistSearchPage        from './pages/PlaylistSearchPage';
import PlaylistPage              from './pages/PlaylistPage';
import GroupPage                 from './pages/GroupPage';
import GroupFeedPage             from './pages/GroupFeedPage';
import GroupPlaylistsPage        from './pages/GroupPlaylistsPage';
import GroupsPage                from './pages/GroupsPage';
import CreateGroupPage           from './pages/CreateGroupPage';
import CreatePlaylistPage        from './pages/CreatePlaylistPage';
import ProfilePage               from './pages/ProfilePage';
import ProfilePlaylistsPage      from './pages/ProfilePlaylistsPage';
import ProfileCollaborationsPage from './pages/ProfileCollaborationsPage';
import ProfileLikesPage          from './pages/ProfileLikesPage';
import ProfileStarsPage          from './pages/ProfileStarsPage';
import PostPage                  from './pages/PostPage';
import SettingsPage              from './pages/SettingsPage';
import ForgotPasswordPage        from './pages/ForgotPasswordPage';
import ResetPasswordPage         from './pages/ResetPasswordPage';
import NotFoundPage              from './pages/NotFoundPage';

export default (
  <Route component={GlobalApp}>

    <IndexRoute component={PlaylistsPage} />

    <Route component={InnerApp}>
      <Redirect from="/" to="/playlists" />

      <Redirect from="/search" to="/search/tracks" />
      <Route path="/search" component={SearchPage}>
        <Route path="playlists" component={PlaylistSearchPage} />
        <Route path="tracks" component={TrackSearchPage} />
        <Route path="groups" component={GroupSearchPage} />
      </Route>

      <Route path="/playlists" component={PlaylistsPage} />
      <Route path="/playlists/create" component={CreatePlaylistPage} />
      <Route path="/playlist/:slug" component={PlaylistPage} />

      <Redirect from="/group/:slug" to="/group/:slug/feed" />
      <Route path="/group/:slug" component={GroupPage}>
        <Route path="feed" component={GroupFeedPage} />
        <Route path="playlists" component={GroupPlaylistsPage} />
      </Route>

      <Route path="/groups" component={GroupsPage} />
      <Route path="/groups/create" component={CreateGroupPage} />

      <Redirect from="/profile/:username" to="/profile/:username/playlists" />
      <Route path="/profile/:username" component={ProfilePage}>
        <Route path="playlists" component={ProfilePlaylistsPage} />
        <Route path="collaborations" component={ProfileCollaborationsPage} />
        <Route path="likes" component={ProfileLikesPage} />
        <Route path="starred" component={ProfileStarsPage} />
      </Route>

      <Route path="/post/:id" component={PostPage} />
      <Route path="/settings" component={SettingsPage} />
    </Route>

    <Route component={OuterApp}>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot" component={ForgotPasswordPage} />
      <Route path="/reset/:userId/:key" component={ResetPasswordPage} />
    </Route>

    <Route path="*" component={NotFoundPage} />

  </Route>
);