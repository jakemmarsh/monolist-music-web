'use strict';

var ViewingPlaylistStore = require('../../app/js/stores/ViewingPlaylistStore');
var CurrentUserStore     = require('../../app/js/stores/CurrentUserStore');
var PlaylistActions      = require('../../app/js/actions/PlaylistActions');
var GlobalActions        = require('../../app/js/actions/GlobalActions');
var TrackActions         = require('../../app/js/actions/TrackActions');
var PlaylistAPI          = require('../../app/js/utils/PlaylistAPI');
var TrackAPI             = require('../../app/js/utils/TrackAPI');

describe('Store: ViewingPlaylist', function() {

  var playlistAPIMock;
  var trackAPIMock;

  before(function() {
    playlistAPIMock = sinon.mock(PlaylistAPI);
    trackAPIMock = sinon.mock(TrackAPI);
    CurrentUserStore.user = { id: 1 };
  });

  it('should load a specific playlist on action', function(done) {
    var playlistSlug = 'test-playlist';
    var ownerName = 'jakemmarsh';

    playlistAPIMock.expects('get').withArgs(playlistSlug, ownerName);

    PlaylistActions.open(playlistSlug, ownerName);

    done();
  });

  it('should follow a playlist on action', function(done) {
    var playlist = { id: 1 };

    playlistAPIMock.expects('follow').withArgs(playlist.id);

    PlaylistActions.follow(playlist);

    done();
  });

  it('should remove a track from a playlist on action', function(done) {
    var playlist = { id: 1 };
    var track = { id: 1 };

    playlistAPIMock.expects('removeTrack').withArgs(playlist.id, track.id);

    PlaylistActions.removeTrack(playlist, track);

    done();
  });

  it('should add a collaborator to a playlist on action', function(done) {
    var playlist = { id: 1 };
    var user = { id: 1 };

    playlistAPIMock.expects('addCollaborator').withArgs(playlist, user);

    PlaylistActions.addCollaborator(playlist, user);

    done();
  });

  it('should remove a collaborator from a playlist on action', function(done) {
    var playlist = { id: 1 };
    var user = { id: 1 };

    playlistAPIMock.expects('removeCollaborator').withArgs(playlist, user);

    PlaylistActions.removeCollaborator(playlist, user);

    done();
  });

  it('should toggle liking a playlist on action', function(done) {
    done();
  });

  it('should add a track comment on action', function(done) {
    var commentBody = 'Test comment';
    var track = { id: 1 };

    trackAPIMock.expects('addComment').withArgs(track.id, commentBody);

    TrackActions.addComment(commentBody, track);

    done();
  });

  it('should remove a track comment on action', function(done) {
    var trackId = 1;
    var commentId = 1;

    trackAPIMock.expects('removeComment').withArgs(trackId, commentId);

    TrackActions.removeComment(trackId, commentId);

    done();
  });

  it('should delete a playlist on action', function(done) {
    var playlistId = 1;

    playlistAPIMock.expects('delete').withArgs(playlistId);

    PlaylistActions.delete(playlistId);

    done();
  });

  after(function() {
    playlistAPIMock.restore();
    trackAPIMock.restore();
  })

});