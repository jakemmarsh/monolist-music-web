'use strict';

import APIUtils  from '../../app/js/utils/APIUtils';
import SearchAPI from '../../app/js/utils/SearchAPI';

describe('Util: SearchAPI', function() {

  const results = [{ id: 1 }, { id: 2 }];

  describe('#trackSearch', function() {
    it('should make a request to search all tracks defaulting to all sources', function(done) {
      const query = 'test';
      const path = 'tracks/search/' + query + '?sources=soundcloud,youtube,bandcamp';
      const getStub = sandbox.stub(APIUtils, 'get').resolves(results);

      SearchAPI.trackSearch(query).then(() => {
        sinon.assert.calledWith(getStub, path);
        done();
      });
    });

    it('should take a variable list of sources for track search', function(done) {
      const query = 'test';
      const sources = ['soundcloud', 'bandcamp'];
      const path = 'tracks/search/' + query + '?sources=soundcloud,bandcamp';
      const getStub = sandbox.stub(APIUtils, 'get').resolves(results);

      SearchAPI.trackSearch(query, sources).then(() => {
        sinon.assert.calledWith(getStub, path);
        done();
      });
    });
  });

  describe('#userSearch', function() {
    it('should make a request to search all users', function(done) {
      const query = 'test';
      const path = 'users/search/' + query;
      const getStub = sandbox.stub(APIUtils, 'get').resolves(results);

      SearchAPI.userSearch(query).then(() => {
        sinon.assert.calledWith(getStub, path);
        done();
      });
    });
  });

  describe('#playlistSearch', function() {
    it('should make a request to search all playlists', function(done) {
      const query = 'test';
      const path = 'playlists/search/' + query;
      const getStub = sandbox.stub(APIUtils, 'get').resolves(results);

      SearchAPI.playlistSearch(query).then(() => {
        sinon.assert.calledWith(getStub, path);
        done();
      });
    });
  });

  describe('#groupSearch', function() {
    it('should make a request to search all groups', function(done) {
      const query = 'test';
      const path = 'groups/search/' + query;
      const getStub = sandbox.stub(APIUtils, 'get').resolves(results);

      SearchAPI.groupSearch(query).then(() => {
        sinon.assert.calledWith(getStub, path);
        done();
      });
    });
  });

});
