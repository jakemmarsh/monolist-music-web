'use strict';

import request  from 'superagent';
import APIUtils from '../../app/js/utils/APIUtils';

describe('Util: APIUtils', function() {

  it('should build stream URL for a track', function() {
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
  });

  it('should normalize a response object with varying keys', function() {
    let beforeObj = {
        camel_case: 'yes', //eslint-disable-line camelcase
        WhatIsThisCase: 'yes'
    };
    let afterObj = { camelCase: 'yes', whatIsThisCase: 'yes' };

    APIUtils.normalizeResponse(beforeObj).should.eql(afterObj);
  });

  it('should make a GET request', function() {
    let path = 'auth/check';

    APIUtils.get(path);

    sinon.assert.calledWith(global.getStub, `http://localhost:3000/v1/${path}`);
  });

  it('should make a POST request', function() {
    let path = 'auth/login';
    let user = {
      username: 'test',
      password: 'test'
    };

    APIUtils.post(path, user);

    sinon.assert.calledWith(global.postStub, `http://localhost:3000/v1/${path}`, user)
  });

  it('should make a PATCH request', function() {
    let path = 'user/1';
    let user = {
      email: 'new@test.com'
    };

    APIUtils.patch(path, user);

    sinon.assert.calledWith(global.patchStub, `http://localhost:3000/v1/${path}`, user);
  });

  it('should make a PUT request', function() {
    let path = 'user/1';
    let user = {
      email: 'new@test.com'
    };

    APIUtils.put(path, user);

    sinon.assert.calledWith(global.putStub, `http://localhost:3000/v1/${path}`, user);
  });

  it('should make a DEL request', function() {
    let path = 'user/1';

    APIUtils.del(path);

    sinon.assert.calledWith(global.delStub, `http://localhost:3000/v1/${path}`);
  });

});