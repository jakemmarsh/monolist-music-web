'use strict';

var APIUtils    = require('../../app/js/utils/APIUtils');
var PlaylistAPI = require('../../app/js/utils/PlaylistAPI');

describe('Util: PlaylistAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(APIUtils);
  });

  it('should make a request to get a specific playlist', function(done) {
    var slug = 'test-playlist';
    var path = 'playlist/' + slug;

    mock.expects('get').withArgs(path);

    PlaylistAPI.get(slug);

    done();
  });

  it('should make a request to search through all playlists', function(done) {
    var query = 'test';
    var path = 'playlists/search/' + query;

    mock.expects('get').withArgs(path);

    PlaylistAPI.search(query);

    done();
  });

  it('should make a request to create a new playlist', function(done) {
    var path = 'playlist'
    var playlist = {};

    mock.expects('post').withArgs(path, playlist);

    PlaylistAPI.create(playlist);

    done();
  });

  it('should make a request to record a play', function(done) {
    var playlistId = 1;
    var path = 'playlist/' + playlistId + '/play';

    mock.expects('post').withArgs(path);

    PlaylistAPI.recordPlay(playlistId);

    done();
  });

  it('should make a request to follow a playlist', function(done) {
    var playlistId = 1;
    var path = 'playlist/' + playlistId + '/follow';

    mock.expects('post').withArgs(path);

    PlaylistAPI.follow(playlistId);

    done();
  });

  it('should make a request to add a collaborator', function(done) {
    var playlistId = 1;
    var userId = 1;
    var path = 'playlist/' + playlistId + '/collaborator/' + userId;

    mock.expects('post').withArgs(path);

    PlaylistAPI.addCollaborator(playlistId, userId);

    done();
  });

  it('should make a request to remove a collaborator', function(done) {
    var playlistId = 1;
    var userId = 1;
    var path = 'playlist/' + playlistId + '/collaborator/' + userId;

    mock.expects('del').withArgs(path);

    PlaylistAPI.removeCollaborator(playlistId, userId);

    done();
  });

  it('should make a request to like a playlist', function(done) {
    var playlistId = 1;
    var path = 'playlist/' + playlistId + '/like';

    mock.expects('post').withArgs(path);

    PlaylistAPI.like(playlistId);

    done();
  });

  it('should make a request to add a track', function(done) {
    var playlistId = 1;
    var path = 'playlist/' + playlistId + '/track';
    var track = {};

    mock.expects('post').withArgs(path, track);

    PlaylistAPI.addTrack(playlistId, track);

    done();
  });

  it('should make a request to remove a track', function(done) {
    var playlistId = 1;
    var trackId = 1;
    var path = 'playlist/' + playlistId + '/track/' + trackId;

    mock.expects('del').withArgs(path);

    PlaylistAPI.removeTrack(playlistId, trackId);

    done();
  });

  it('should make a request to delete a playlist', function(done) {
    var playlistId = 1;
    var path = 'playlist/' + playlistId;

    mock.expects('del').withArgs(path);

    PlaylistAPI.delete(playlistId);

    done();
  });

  after(function() {
    mock.restore();
  });

});