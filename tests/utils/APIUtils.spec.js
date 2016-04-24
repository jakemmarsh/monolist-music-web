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

  it('#normalizeResponse should normalize a response object with varying keys', function() {
    const beforeObj = {
        camel_case: 'yes', //eslint-disable-line camelcase
        WhatIsThisCase: 'yes'
    };
    const afterObj = { camelCase: 'yes', whatIsThisCase: 'yes' };

    APIUtils.normalizeResponse(beforeObj).should.eql(afterObj);
  });

  it('#get should make a GET request', function() {
    const path = 'auth/check';

    sandbox.stub(request, 'get');

    APIUtils.get(path);

    sinon.assert.calledOnce(request.get);
    sinon.assert.calledWith(request.get, `http://localhost:3000/v1/${path}`);
  });

  it('#post should make a POST request', function() {
    const path = 'auth/login';
    const user = {
      username: 'test',
      password: 'test'
    };

    sandbox.stub(request, 'post');

    APIUtils.post(path, user);

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWith(request.post, `http://localhost:3000/v1/${path}`, user);
  });

  it('#patch should make a PATCH request', function() {
    const path = 'user/1';
    const user = {
      email: 'new@test.com'
    };

    sandbox.stub(request, 'patch');

    APIUtils.patch(path, user);

    sinon.assert.calledOnce(request.patch);
    sinon.assert.calledWith(request.patch, `http://localhost:3000/v1/${path}`, user);
  });

  it('#put should make a PUT request', function() {
    const path = 'user/1';
    const user = {
      email: 'new@test.com'
    };

    sandbox.stub(request, 'put');

    APIUtils.put(path, user);

    sinon.assert.calledOnce(request.put);
    sinon.assert.calledWith(request.put, `http://localhost:3000/v1/${path}`, user);
  });

  it('#del should make a DEL request', function() {
    const path = 'user/1';

    sandbox.stub(request, 'del');

    APIUtils.del(path);

    sinon.assert.calledOnce(request.del);
    sinon.assert.calledWith(request.del, `http://localhost:3000/v1/${path}`);
  });

  it('#buildTwitterUrl should build the correct URL for sharing a tweet', function() {
    const text = 'test tweet';
    const tags = ['foo', 'bar'];
    const expectedTags = tags.concat(['Monolist']).join(',');
    const url = 'http://google.com';
    const expectedUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(expectedTags)}&url=${encodeURIComponent(url)}`;

    assert.strictEqual(APIUtils.buildTwitterUrl(text, tags, url), expectedUrl);
  });

});
