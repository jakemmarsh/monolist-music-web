'use strict';

import request  from 'superagent';
import APIUtils from '../../app/js/utils/APIUtils';

describe('Util: APIUtils', function() {

  describe('#getStreamUrl', function() {
    it('should build stream URL for an audiomack track', function() {
      const track = {
        source: 'audiomack',
        title: 'About The Money (CDQ)',
        artist: 'T.I. Ft. Young Thug',
        imageUrl: 'https://d3m79pznqer0b2.cloudfront.net/dirty-glove-bastard/8377df530967d1a7b11c4a2b080745ce-275-275.jpeg',
        sourceParam: '202182',
        sourceUrl: 'http://audiomack.com/song/dirty-glove-bastard/about-the-money-cdq'
      };
      const url = APIUtils.getStreamUrl(track);

      url.should.equal('http://localhost:3000/v1/stream/audiomack/' + encodeURIComponent(track.sourceUrl));
    });

    it('should build stream URL for other tracks', function() {
      const track = {
        imageUrl: 'https://i1.sndcdn.com/artworks-000086001473-mw7dye-large.jpg',
        PlaylistId: 1,
        UserId: 1,
        source: 'soundcloud',
        sourceParam: '159945668',
        sourceUrl: 'http://soundcloud.com/rustie/attak-feat-danny-brown',
        title: 'Attak (feat. Danny Brown)',
        duration: 181
      };
      const url = APIUtils.getStreamUrl(track);

      url.should.equal('http://localhost:3000/v1/stream/' + track.source + '/' + encodeURIComponent(track.sourceParam));
    });
  });

  it('should normalize a response object with varying keys', function() {
    const beforeObj = {
        camel_case: 'yes', //eslint-disable-line camelcase
        WhatIsThisCase: 'yes'
    };
    const afterObj = { camelCase: 'yes', whatIsThisCase: 'yes' };

    APIUtils.normalizeResponse(beforeObj).should.eql(afterObj);
  });

  it('should make a GET request', function() {
    const path = 'auth/check';

    sandbox.mock(request).expects('get').withArgs(`http://localhost:3000/v1/${path}`);

    APIUtils.get(path);
  });

  it('should make a POST request', function() {
    const path = 'auth/login';
    const user = {
      username: 'test',
      password: 'test'
    };

    sandbox.mock(request).expects('post').withArgs(`http://localhost:3000/v1/${path}`, user);

    APIUtils.post(path, user);
  });

  it('should make a PATCH request', function() {
    const path = 'user/1';
    const user = {
      email: 'new@test.com'
    };

    sandbox.mock(request).expects('patch').withArgs(`http://localhost:3000/v1/${path}`, user);

    APIUtils.patch(path, user);
  });

  it('should make a PUT request', function() {
    const path = 'user/1';
    const user = {
      email: 'new@test.com'
    };

    sandbox.mock(request).expects('put').withArgs(`http://localhost:3000/v1/${path}`, user);

    APIUtils.put(path, user);
  });

  it('should make a DEL request', function() {
    const path = 'user/1';

    sandbox.mock(request).expects('del').withArgs(`http://localhost:3000/v1/${path}`);

    APIUtils.del(path);
  });

});