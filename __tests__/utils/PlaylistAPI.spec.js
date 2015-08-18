'use strict';

import APIUtils    from '../../app/js/utils/APIUtils';
import PlaylistAPI from '../../app/js/utils/PlaylistAPI';

describe('Util: PlaylistAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to get a specific playlist', function(done) {
    let slug = 'test-playlist';
    let path = 'playlist/' + slug;

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.get(slug);

    done();
  });

  it('should make a request to search through all playlists', function(done) {
    let query = 'test';
    let path = 'playlists/search/' + query;

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.search(query);

    done();
  });

  it('should make a request to create a new playlist', function(done) {
    let path = 'playlist'
    let playlist = {};

    this.apiUtilsMock.expects('post').withArgs(path, playlist);

    PlaylistAPI.create(playlist);

    done();
  });

  it('should make a request to record a play', function(done) {
    let playlistId = 1;
    let path = 'playlist/' + playlistId + '/play';

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.recordPlay(playlistId);

    done();
  });

  it('should make a request to follow a playlist', function(done) {
    let playlistId = 1;
    let path = 'playlist/' + playlistId + '/follow';

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.follow(playlistId);

    done();
  });

  it('should make a request to add a collaborator', function(done) {
    let playlistId = 1;
    let userId = 1;
    let path = 'playlist/' + playlistId + '/collaborator/' + userId;

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.addCollaborator(playlistId, userId);

    done();
  });

  it('should make a request to remove a collaborator', function(done) {
    let playlistId = 1;
    let userId = 1;
    let path = 'playlist/' + playlistId + '/collaborator/' + userId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PlaylistAPI.removeCollaborator(playlistId, userId);

    done();
  });

  it('should make a request to like a playlist', function(done) {
    let playlistId = 1;
    let path = 'playlist/' + playlistId + '/like';

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.like(playlistId);

    done();
  });

  it('should make a request to add a track', function(done) {
    let playlistId = 1;
    let path = 'playlist/' + playlistId + '/track';
    let track = {};

    this.apiUtilsMock.expects('post').withArgs(path, track);

    PlaylistAPI.addTrack(playlistId, track);

    done();
  });

  it('should make a request to remove a track', function(done) {
    let playlistId = 1;
    let trackId = 1;
    let path = 'playlist/' + playlistId + '/track/' + trackId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PlaylistAPI.removeTrack(playlistId, trackId);

    done();
  });

  it('should make a request to delete a playlist', function(done) {
    let playlistId = 1;
    let path = 'playlist/' + playlistId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PlaylistAPI.delete(playlistId);

    done();
  });

});