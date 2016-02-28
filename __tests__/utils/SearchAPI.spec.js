'use strict';

import when      from 'when';
import lscache   from 'lscache';

import APIUtils  from '../../app/js/utils/APIUtils';
import SearchAPI from '../../app/js/utils/SearchAPI';

describe('Util: SearchAPI', function() {

  const results = [{ id: 1 }, { id: 2 }];

  describe('#trackSearch', function() {
    context('when key doesn\'t exist in cache', function() {
      beforeEach(function() {
        sandbox.stub(lscache, 'get').returns(null);
      });

      it('should make a request to search all tracks defaulting to all sources and store in cache', function(done) {
        const query = 'test';
        const path = 'tracks/search/' + query + '?sources=soundcloud,youtube,bandcamp';
        const key = `trackSearch:${query}:soundcloud,youtube,bandcamp`;
        const getStub = sandbox.stub(APIUtils, 'get').returns(when(results));
        const setStub = sandbox.stub(lscache, 'set');

        SearchAPI.trackSearch(query).then(() => {
          sinon.assert.calledWith(getStub, path);
          sinon.assert.calledWith(setStub, key, results);
          done();
        });
      });

      it('should take a variable list of sources for track search and store in cache', function(done) {
        const query = 'test';
        const sources = ['soundcloud', 'bandcamp'];
        const key = `trackSearch:${query}:${sources.join(',')}`;
        const path = 'tracks/search/' + query + '?sources=soundcloud,bandcamp';
        const getStub = sandbox.stub(APIUtils, 'get').returns(when(results));
        const setStub = sandbox.stub(lscache, 'set');

        SearchAPI.trackSearch(query, sources).then(() => {
          sinon.assert.calledWith(getStub, path);
          sinon.assert.calledWith(setStub, key, results);
          done();
        });
      });
    });

    context('when key does exist in cache', function() {
      it('should retrieve the results from the cache', function(done) {
        const query = 'test';
        const sources = ['soundcloud', 'bandcamp'];
        const key = `trackSearch:${query}:${sources.join(',')}`;
        const getStub = sandbox.stub(lscache, 'get').withArgs(key).returns(results);

        SearchAPI.trackSearch(query, sources).then((searchResults) => {
          sinon.assert.calledOnce(getStub);
          searchResults.should.eql(results);
          done();
        });
      });
    });
  });

  describe('#userSearch', function() {
    context('when key doesn\'t exist in cache', function() {
      beforeEach(function() {
        sandbox.stub(lscache, 'get').returns(null);
      });

      it('should make a request to search all users and store in cache', function(done) {
        const query = 'test';
        const path = 'users/search/' + query;
        const key = `userSearch:${query}`;
        const getStub = sandbox.stub(APIUtils, 'get').returns(when(results));
        const setStub = sandbox.stub(lscache, 'set');

        SearchAPI.userSearch(query).then(() => {
          sinon.assert.calledWith(getStub, path);
          sinon.assert.calledWith(setStub, key, results);
          done();
        });
      });
    });

    context('when key does exist in cache', function() {
      it('should retrieve the results from the cache', function(done) {
        const query = 'test';
        const key = `userSearch:${query}`;
        const getStub = sandbox.stub(lscache, 'get').withArgs(key).returns(results);

        SearchAPI.userSearch(query).then((searchResults) => {
          sinon.assert.calledOnce(getStub);
          searchResults.should.eql(results);
          done();
        });
      });
    });
  });

  describe('#playlistSearch', function() {
    context('when key doesn\'t exist in cache', function() {
      beforeEach(function() {
        sandbox.stub(lscache, 'get').returns(null);
      });

      it('should make a request to search all playlists and store in cache', function(done) {
        const query = 'test';
        const path = 'playlists/search/' + query;
        const key = `playlistSearch:${query}`;
        const getStub = sandbox.stub(APIUtils, 'get').returns(when(results));
        const setStub = sandbox.stub(lscache, 'set');

        SearchAPI.playlistSearch(query).then(() => {
          sinon.assert.calledWith(getStub, path);
          sinon.assert.calledWith(setStub, key, results);
          done();
        });
      });
    });

    context('when key does exist in cache', function() {
      it('should retrieve the results from the cache', function(done) {
        const query = 'test';
        const key = `playlistSearch:${query}`;
        const getStub = sandbox.stub(lscache, 'get').withArgs(key).returns(results);

        SearchAPI.playlistSearch(query).then((searchResults) => {
          sinon.assert.calledOnce(getStub);
          searchResults.should.eql(results);
          done();
        });
      });
    });
  });

  describe('#groupSearch', function() {
    context('when key doesn\'t exist in cache', function() {
      beforeEach(function() {
        sandbox.stub(lscache, 'get').returns(null);
      });

      it('should make a request to search all groups and store in cache', function(done) {
        const query = 'test';
        const path = 'groups/search/' + query;
        const key = `groupSearch:${query}`;
        const getStub = sandbox.stub(APIUtils, 'get').returns(when(results));
        const setStub = sandbox.stub(lscache, 'set');

        SearchAPI.groupSearch(query).then(() => {
          sinon.assert.calledWith(getStub, path);
          sinon.assert.calledWith(setStub, key, results);
          done();
        });
      });
    });

    context('when key does exist in cache', function() {
      it('should retrieve the results from the cache', function(done) {
        const query = 'test';
        const key = `groupSearch:${query}`;
        const getStub = sandbox.stub(lscache, 'get').withArgs(key).returns(results);

        SearchAPI.groupSearch(query).then((searchResults) => {
          sinon.assert.calledOnce(getStub);
          searchResults.should.eql(results);
          done();
        });
      });
    });
  });

});