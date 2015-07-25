'use strict';

var APIUtils = require('../../app/js/utils/APIUtils');
var request  = require('superagent');

describe('Util: APIUtils', function() {

  var mock;

  before(function() {
    mock = sinon.mock(request);
  });

  it('should build stream URL for a track', function(done) {
    var track = {
      imageUrl: 'https://i1.sndcdn.com/artworks-000086001473-mw7dye-large.jpg',
      PlaylistId: 1,
      UserId: 1,
      source: 'soundcloud',
      sourceParam: '159945668',
      sourceUrl: 'http://soundcloud.com/rustie/attak-feat-danny-brown',
      title: 'Attak (feat. Danny Brown)',
      duration: 181
    };
    var url = APIUtils.getStreamUrl(track);

    url.should.equal('http://localhost:3000/v1/stream/' + track.source + '/' + track.sourceParam);

    done();
  });

  it('should normalize an object with varying keys', function(done) {
    var beforeObj = { camel_case: 'yes', WhatIsThisCase: 'yes' };
    var afterObj = { camelCase: 'yes', whatIsThisCase: 'yes' };

    APIUtils.normalizeResponse(beforeObj).should.eql(afterObj);

    done();
  });

  it('should make a GET request', function(done) {
    var path = 'auth/check';

    mock.expects('get').withArgs('http://localhost:3000/v1/' + path);

    APIUtils.get(path);

    done();
  });

  it('should make a POST request', function(done) {
    var path = 'auth/login'
    var user = {
      username: 'test',
      password: 'test'
    };

    mock.expects('post').withArgs('http://localhost:3000/v1/' + path, user);

    APIUtils.post(path, user);

    done();
  });

  it('should make a PATCH request', function(done) {
    var path = 'user/1';
    var user = {
      email: 'new@test.com'
    };

    mock.expects('patch').withArgs('http://localhost:3000/v1/' + path, user);

    APIUtils.patch(path, user);

    done();
  });

  it('should make a PUT request', function(done) {
    var path = 'user/1';
    var user = {
      email: 'new@test.com'
    };

    mock.expects('put').withArgs('http://localhost:3000/v1/' + path, user);

    APIUtils.put(path, user);

    done();
  });

  it('should make a DEL request', function(done) {
    var path = 'user/1';

    mock.expects('del').withArgs('http://localhost:3000/v1/' + path);

    APIUtils.del(path);

    done();
  });

  after(function() {
    mock.restore();
  });

});