'use strict';

import APIUtils    from '../../app/js/utils/APIUtils';
import PlaylistAPI from '../../app/js/utils/PlaylistAPI';

describe('Util: PlaylistAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to get a specific playlist', function(done) {
    const slug = 'test-playlist';
    const path = 'playlist/' + slug;

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.get(slug);

    done();
  });

  it('should make a request to get newest playlists', function(done) {
    const path = 'playlists/newest';

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.getNewest();

    done();
  });

  it('should make a request to get trending playlists', function(done) {
    const path = 'playlists/trending';

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.getTrending();

    done();
  });

  it('should make a request to get trending playlists', function(done) {
    const path = 'playlists/played/recent';

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.getRecentlyPlayed();

    done();
  });

  it('should make a request to get recent playlist searches', function(done) {
    const path = 'playlists/searches';

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.getRecentSearches();

    done();
  });

  it('should make a request to search through all playlists', function(done) {
    const query = 'test';
    const path = 'playlists/search/' + query;

    this.apiUtilsMock.expects('get').withArgs(path);

    PlaylistAPI.search(query);

    done();
  });

  it('should make a request to create a new playlist', function(done) {
    const path = 'playlist';
    const playlist = {};

    this.apiUtilsMock.expects('post').withArgs(path, playlist);

    PlaylistAPI.create(playlist);

    done();
  });

  it('should make a request to update a group', function(done) {
    const playlistId = 1;
    const path = 'playlist/' + playlistId;
    const updates = {};

    this.apiUtilsMock.expects('patch').withArgs(path, updates);

    PlaylistAPI.update(playlistId, updates);

    done();
  });

  it('should make a request to record a play', function(done) {
    const playlistId = 1;
    const path = 'playlist/' + playlistId + '/play';

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.recordPlay(playlistId);

    done();
  });

  it('should make a request to follow a playlist', function(done) {
    const playlistId = 1;
    const path = 'playlist/' + playlistId + '/follow';

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.follow(playlistId);

    done();
  });

  it('should make a request to add a collaborator', function(done) {
    const playlistId = 1;
    const userId = 1;
    const path = 'playlist/' + playlistId + '/collaborator/' + userId;

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.addCollaborator(playlistId, userId);

    done();
  });

  it('should make a request to remove a collaborator', function(done) {
    const playlistId = 1;
    const userId = 1;
    const path = 'playlist/' + playlistId + '/collaborator/' + userId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PlaylistAPI.removeCollaborator(playlistId, userId);

    done();
  });

  it('should make a request to like a playlist', function(done) {
    const playlistId = 1;
    const path = 'playlist/' + playlistId + '/like';

    this.apiUtilsMock.expects('post').withArgs(path);

    PlaylistAPI.like(playlistId);

    done();
  });

  it('should make a request to add a track', function(done) {
    const playlistId = 1;
    const path = 'playlist/' + playlistId + '/track';
    const track = {};

    this.apiUtilsMock.expects('post').withArgs(path, track);

    PlaylistAPI.addTrack(playlistId, track);

    done();
  });

  it('should make a request to remove a track', function(done) {
    const playlistId = 1;
    const trackId = 1;
    const path = 'playlist/' + playlistId + '/track/' + trackId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PlaylistAPI.removeTrack(playlistId, trackId);

    done();
  });

  it('should make a request to delete a playlist', function(done) {
    const playlistId = 1;
    const path = 'playlist/' + playlistId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PlaylistAPI.delete(playlistId);

    done();
  });

});