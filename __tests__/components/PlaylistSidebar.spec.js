'use strict';

import React                from 'react';
import TestUtils            from 'react-addons-test-utils';
import $                    from 'jquery';

import TestHelpers          from '../../utils/testHelpers';
import PlaylistSidebar      from '../../app/js/components/PlaylistSidebar';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';

describe('Component: PlaylistSidebar', function() {

  const playlist = TestHelpers.fixtures.playlist;
  const user = TestHelpers.fixtures.user;

  it('#componentWillReceiveProps should update state if a new playlist is received', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={user} />
    );
    const newPlaylist = {
      id: 2,
      likes: [{ userId: user.id }],
      followers: [{ userId: user.id }]
    };

    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserDoesLike: true,
      numLikes: 1,
      currentUserDoesFollow: true
    });

    sidebar.componentWillReceiveProps({
      playlist: newPlaylist,
      currentUser: user
    });
  });

  it('#componentDidUpdate should add hover/mouseleave actions to follow button if user does follow', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} />
    );

    sandbox.mock($('.follow-button.inactive')).expects('hover').once();
    sandbox.mock($('.follow-button.inactive')).expects('mouseleave').once();
    sidebar.setState({ currentUserDoesFollow: true });

    sidebar.componentDidUpdate();
  });

  it('#componentDidUpdate should unbind actions from follow button if user does not follow', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} />
    );

    sandbox.mock($('.follow-button')).expects('unbind').withArgs('mouseenter mouseleave').once();
    sidebar.setState({ currentUserDoesFollow: false });

    sidebar.componentDidUpdate();
  });

  it('#setPrivacyLevel should invoke the playlist update action', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} />
    );
    const newPrivacyLevel = 'private';

    sandbox.mock(PlaylistActions).expects('update').once().withArgs(playlist.id, {
      privacy: newPrivacyLevel
    });

    sidebar.setPrivacyLevel(newPrivacyLevel);
  });

  it('#toggleFollowPlaylist should flip following state and call action', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} />
    );

    sandbox.mock(PlaylistActions).expects('follow').withArgs(playlist).once();
    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserDoesFollow: !sidebar.state.currentUserDoesFollow
    });

    sidebar.toggleFollowPlaylist();
  });

  it('#toggleLikePlaylist should flip liked state and call action', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} />
    );

    ViewingPlaylistStore.playlist = playlist;
    sandbox.mock(PlaylistActions).expects('like').withArgs(playlist.id).once();
    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserDoesLike: !sidebar.state.currentUserDoesLike,
      numLikes: sidebar.state.currentUserDoesLike ? sidebar.state.numLikes - 1 : sidebar.state.numLikes + 1
    });

    sidebar.toggleLikePlaylist();
  });

  it('#renderPlaylistCreator should only return an element if there is a playlist with an owner', function() {
    let sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={{ owner: {} }} />
    );

    Should(sidebar.renderPlaylistCreator()).be.undefined();

    sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} />
    );

    Should(sidebar.renderPlaylistCreator()).not.be.undefined();
  });

  it('#renderLikeButton should only return an element if there is a currentUser', function() {
    let sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={{}} />
    );

    Should(sidebar.renderLikeButton()).be.undefined();

    sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={user} />
    );

    Should(sidebar.renderLikeButton()).not.be.undefined();
  });

  it('#renderFollowButton should only return an element if currentUser does not own playlist and they both exist', function() {
    let sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={{}} />
    );

    Should(sidebar.renderFollowButton()).be.undefined();

    sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={{ id: 2 }} />
    );

    Should(sidebar.renderFollowButton()).not.be.undefined();
  });

  it('#renderShareButton should only return an element if there is a playlist and it\'s not private', function() {
    const privatePlaylist = JSON.parse(JSON.stringify(playlist));
    privatePlaylist.privacy = 'private';
    let sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={privatePlaylist} currentUser={user} />
    );

    Should(sidebar.renderShareButton()).be.undefined();

    sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={user} />
    );

    Should(sidebar.renderShareButton()).not.be.undefined();
  });

  it('clicking the like button should invoke #toggleLikePlaylist', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={user} />
    );
    const likeButton = sidebar.refs.likeButton;

    sandbox.mock(sidebar).expects('toggleLikePlaylist').once();

    TestUtils.Simulate.click(likeButton);
  });

  it('clicking the follow button should invoke #toggleFollowPlaylist', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={{ id: 2 }} />
    );
    const followButton = sidebar.refs.followButton;

    sandbox.mock(sidebar).expects('toggleFollowPlaylist').once();

    TestUtils.Simulate.click(followButton);
  });

  it('clicking the share button should invoke #toggleShareModal', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} currentUser={user} />
    );
    const shareButton = sidebar.refs.shareButton;

    sandbox.mock(sidebar).expects('toggleShareModal').once();

    TestUtils.Simulate.click(shareButton);
  });

});