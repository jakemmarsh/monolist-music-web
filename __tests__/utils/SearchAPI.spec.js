'use strict';

var APIUtils  = require('../../app/js/utils/APIUtils');
var SearchAPI = require('../../app/js/utils/SearchAPI');

describe('Util: SearchAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(APIUtils);
  });

  it('should make a request to search all tracks defaulting to all sources', function(done) {
    var query = 'test';
    var path = 'tracks/search/' + query + '?sources=soundcloud,youtube,bandcamp';

    mock.expects('get').withArgs(path);

    SearchAPI.trackSearch(query);

    done();
  });

  it('should take a variable list of sources for track search', function(done) {
    var query = 'test';
    var sources = ['soundcloud', 'bandcamp'];
    var path = 'tracks/search/' + query + '?sources=soundcloud,bandcamp';

    mock.expects('get').withArgs(path);

    SearchAPI.trackSearch(query, sources);

    done();
  });

  it('should make a request to search all users', function(done) {
    var query = 'test';
    var path = 'users/search/' + query;

    mock.expects('get').withArgs(path);

    SearchAPI.userSearch(query);

    done();
  });

  it('should make a request to search all playlists', function(done) {
    var query = 'test';
    var path = 'playlists/search/' + query;

    mock.expects('get').withArgs(path);

    SearchAPI.playlistSearch(query);

    done();
  });

  it('should make a request to search all groups', function(done) {
    var query = 'test';
    var path = 'groups/search/' + query;

    mock.expects('get').withArgs(path);

    SearchAPI.groupSearch(query);

    done();
  });

  after(function() {
    mock.restore();
  });

});