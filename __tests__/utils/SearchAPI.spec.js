'use strict';

import APIUtils  from '../../app/js/utils/APIUtils';
import SearchAPI from '../../app/js/utils/SearchAPI';

describe('Util: SearchAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to search all tracks defaulting to all sources', function(done) {
    let query = 'test';
    let path = 'tracks/search/' + query + '?sources=soundcloud,youtube,bandcamp';

    this.apiUtilsMock.expects('get').withArgs(path);

    SearchAPI.trackSearch(query);

    done();
  });

  it('should take a variable list of sources for track search', function(done) {
    let query = 'test';
    let sources = ['soundcloud', 'bandcamp'];
    let path = 'tracks/search/' + query + '?sources=soundcloud,bandcamp';

    this.apiUtilsMock.expects('get').withArgs(path);

    SearchAPI.trackSearch(query, sources);

    done();
  });

  it('should make a request to search all users', function(done) {
    let query = 'test';
    let path = 'users/search/' + query;

    this.apiUtilsMock.expects('get').withArgs(path);

    SearchAPI.userSearch(query);

    done();
  });

  it('should make a request to search all playlists', function(done) {
    let query = 'test';
    let path = 'playlists/search/' + query;

    this.apiUtilsMock.expects('get').withArgs(path);

    SearchAPI.playlistSearch(query);

    done();
  });

  it('should make a request to search all groups', function(done) {
    let query = 'test';
    let path = 'groups/search/' + query;

    this.apiUtilsMock.expects('get').withArgs(path);

    SearchAPI.groupSearch(query);

    done();
  });

});