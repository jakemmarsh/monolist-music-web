'use strict';

import when                 from 'when';

import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';
import CurrentUserStore     from '../../app/js/stores/CurrentUserStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import TrackActions         from '../../app/js/actions/TrackActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';
import TrackAPI             from '../../app/js/utils/TrackAPI';
import TestHelpers          from '../../utils/testHelpers';

describe('Store: ViewingPlaylist', function() {

  const playlist = JSON.parse(JSON.stringify(TestHelpers.fixtures.playlist));
  const track = JSON.parse(JSON.stringify(TestHelpers.fixtures.playlist));
  const user = JSON.parse(JSON.stringify(TestHelpers.fixtures.user));

  beforeEach(function() {
    this.playlistAPIMock = sandbox.mock(PlaylistAPI);
    this.trackAPIMock = sandbox.mock(TrackAPI);
    CurrentUserStore.user = user;
    ViewingPlaylistStore.playlist = playlist;
  });

  it('should load a specific playlist on action', function() {
    let playlistSlug = playlist.slug;

    this.playlistAPIMock.expects('get').withArgs(playlistSlug).returns(when(playlist));

    PlaylistActions.open(playlistSlug);
  });

  it('should update a group on action', function() {
    let playlistId = playlist.id;
    let updates = {
      title: 'new title'
    };

    this.playlistAPIMock.expects('update').withArgs(playlistId, updates).returns(when());

    PlaylistActions.update(playlistId, updates);
  });

  it('should follow a playlist on action', function() {
    this.playlistAPIMock.expects('follow').withArgs(playlist.id).returns(when());

    PlaylistActions.follow(playlist);
  });

  it('should remove a track from a playlist on action', function() {
    this.playlistAPIMock.expects('removeTrack').withArgs(playlist.id, track.id).returns(when());

    PlaylistActions.removeTrack(playlist, track);
  });

  it('should add a collaborator to a playlist on action', function() {
    this.playlistAPIMock.expects('addCollaborator').withArgs(playlist.id, user.id).returns(when());

    PlaylistActions.addCollaborator(playlist, user);
  });

  it('should remove a collaborator from a playlist on action', function() {
    this.playlistAPIMock.expects('removeCollaborator').withArgs(playlist.id, user.id).returns(when());

    PlaylistActions.removeCollaborator(playlist, user);
  });

  it('should toggle liking current playlist on action', function() {
    this.playlistAPIMock.expects('like').withArgs(playlist.id, user.id).returns(when());

    PlaylistActions.like();
  });

  it('should add a track comment on action', function() {
    let commentBody = 'Test comment';

    this.trackAPIMock.expects('addComment').withArgs(track.id, commentBody).returns(when());

    TrackActions.addComment(commentBody, track);
  });

  it('should remove a track comment on action', function() {
    let commentId = 1;

    this.trackAPIMock.expects('removeComment').withArgs(track.id, commentId).returns(when());

    TrackActions.removeComment(track.id, commentId);
  });

  it('should delete a playlist on action', function() {
    this.playlistAPIMock.expects('delete').withArgs(playlist.id).returns(when());

    PlaylistActions.delete(playlist);
  });

});