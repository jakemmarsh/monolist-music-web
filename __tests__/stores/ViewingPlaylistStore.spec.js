'use strict';

import when                 from 'when';

import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';
import CurrentUserStore     from '../../app/js/stores/CurrentUserStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import TrackActions         from '../../app/js/actions/TrackActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';
import TrackAPI             from '../../app/js/utils/TrackAPI';

describe('Store: ViewingPlaylist', function() {

  beforeEach(function() {
    this.playlistAPIMock = sandbox.mock(PlaylistAPI);
    this.trackAPIMock = sandbox.mock(TrackAPI);
    CurrentUserStore.user = { id: 1 };
  });

  it('should load a specific playlist on action', function(done) {
    let playlistSlug = 'test-playlist';
    let ownerName = 'jakemmarsh';

    this.playlistAPIMock.expects('get').withArgs(playlistSlug, ownerName).returns(when());

    PlaylistActions.open(playlistSlug, ownerName);

    done();
  });

  it('should update a group on action', function() {
    let playlistId = 1;
    let updates = {
      title: 'new title'
    };

    this.playlistAPIMock.expects('update').withArgs(playlistId, updates);

    PlaylistActions.update(playlistId, updates);
  });

  it('should follow a playlist on action', function(done) {
    let playlist = { id: 1 };

    this.playlistAPIMock.expects('follow').withArgs(playlist.id).returns(when());

    PlaylistActions.follow(playlist);

    done();
  });

  it('should remove a track from a playlist on action', function(done) {
    let playlist = { id: 1 };
    let track = { id: 1 };

    this.playlistAPIMock.expects('removeTrack').withArgs(playlist.id, track.id).returns(when());

    PlaylistActions.removeTrack(playlist, track);

    done();
  });

  it('should add a collaborator to a playlist on action', function(done) {
    let playlist = { id: 1 };
    let user = { id: 1 };

    this.playlistAPIMock.expects('addCollaborator').withArgs(playlist, user).returns(when());

    PlaylistActions.addCollaborator(playlist, user);

    done();
  });

  it('should remove a collaborator from a playlist on action', function(done) {
    let playlist = { id: 1 };
    let user = { id: 1 };

    this.playlistAPIMock.expects('removeCollaborator').withArgs(playlist, user).returns(when());

    PlaylistActions.removeCollaborator(playlist, user);

    done();
  });

  it('should toggle liking a playlist on action', function(done) {
    done();
  });

  it('should add a track comment on action', function(done) {
    let commentBody = 'Test comment';
    let track = { id: 1 };

    this.trackAPIMock.expects('addComment').withArgs(track.id, commentBody).returns(when());

    TrackActions.addComment(commentBody, track);

    done();
  });

  it('should remove a track comment on action', function(done) {
    let trackId = 1;
    let commentId = 1;

    this.trackAPIMock.expects('removeComment').withArgs(trackId, commentId).returns(when());

    TrackActions.removeComment(trackId, commentId);

    done();
  });

  it('should delete a playlist on action', function(done) {
    let playlistId = 1;

    this.playlistAPIMock.expects('delete').withArgs(playlistId).returns(when());

    PlaylistActions.delete(playlistId);

    done();
  });

});