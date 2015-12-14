'use strict';

import request  from 'superagent';
import APIUtils from '../../app/js/utils/APIUtils';

describe('Util: APIUtils', function() {

  beforeEach(function() {
    sandbox.restore(); // unstub HTTP methods
  });

  it('should build stream URL for a track', function(done) {
    let track = {
      imageUrl: 'https://i1.sndcdn.com/artworks-000086001473-mw7dye-large.jpg',
      PlaylistId: 1,
      UserId: 1,
      source: 'soundcloud',
      sourceParam: '159945668',
      sourceUrl: 'http://soundcloud.com/rustie/attak-feat-danny-brown',
      title: 'Attak (feat. Danny Brown)',
      duration: 181
    };
    let url = APIUtils.getStreamUrl(track);

    url.should.equal('http://localhost:3000/v1/stream/' + track.source + '/' + track.sourceParam);

    done();
  });

  it('should normalize a response object with varying keys', function(done) {
    let beforeObj = {
        camel_case: 'yes', //eslint-disable-line camelcase
        WhatIsThisCase: 'yes'
    };
    let afterObj = { camelCase: 'yes', whatIsThisCase: 'yes' };

    APIUtils.normalizeResponse(beforeObj).should.eql(afterObj);

    done();
  });

  it('should make a GET request', function(done) {
    let path = 'auth/check';

    sandbox.mock(request).expects('get').withArgs('http://localhost:3000/v1/' + path);

    APIUtils.get(path);

    done();
  });

  it('should make a POST request', function(done) {
    let path = 'auth/login';
    let user = {
      username: 'test',
      password: 'test'
    };

    sandbox.mock(request).expects('post').withArgs('http://localhost:3000/v1/' + path, user);

    APIUtils.post(path, user);

    done();
  });

  it('should make a PATCH request', function(done) {
    let path = 'user/1';
    let user = {
      email: 'new@test.com'
    };

    sandbox.mock(request).expects('patch').withArgs('http://localhost:3000/v1/' + path, user);

    APIUtils.patch(path, user);

    done();
  });

  it('should make a PUT request', function(done) {
    let path = 'user/1';
    let user = {
      email: 'new@test.com'
    };

    sandbox.mock(request).expects('put').withArgs('http://localhost:3000/v1/' + path, user);

    APIUtils.put(path, user);

    done();
  });

  it('should make a DEL request', function(done) {
    let path = 'user/1';

    sandbox.mock(request).expects('del').withArgs('http://localhost:3000/v1/' + path);

    APIUtils.del(path);

    done();
  });

});