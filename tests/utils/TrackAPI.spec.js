'use strict';

import APIUtils from '../../app/js/utils/APIUtils';
import TrackAPI from '../../app/js/utils/TrackAPI';

describe('Util: TrackAPI', function() {

  describe('#getTrackDetails', function() {
    const details = { title: 'test', source: 'youtube' };

    it('should make a request to get details about a track by URL and store in cache', function(done) {
      const url = 'https://www.youtube.com/watch?v=eLwHD6ae5Sc';
      const source = 'youtube';
      const path = 'details/' + source + '/' + encodeURIComponent(url);
      const getStub = sandbox.stub(APIUtils, 'get').resolves(details);

      TrackAPI.getTrackDetails(source, url).then(() => {
        sinon.assert.calledWith(getStub, path);
        done();
      });
    });
  });

  it('should make a request to star a track', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const path = 'track/star';
    const track = {};

    TrackAPI.star(track);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path, track);
  });

  it('should make a request to upvote a track', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const trackId = 1;
    const path = `track/${trackId}/upvote`;

    TrackAPI.upvote(trackId);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path);
  });

  it('should make a request to downvote a track', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const trackId = 1;
    const path = `track/${trackId}/downvote`;

    TrackAPI.downvote(trackId);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path);
  });

  it('should make a request to add a comment', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const trackId = 1;
    const path = `track/${trackId}/comment`;
    const commentBody = '';

    TrackAPI.addComment(trackId, commentBody);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path, { body: commentBody });
  });

  it('should make a request to upvote a track', function() {
    const delStub = sandbox.stub(APIUtils, 'del');
    const trackId = 1;
    const commentId = 1;
    const path = `track/${trackId}/comment/${commentId}`;

    TrackAPI.removeComment(trackId, commentId);

    sinon.assert.calledOnce(delStub);
    sinon.assert.calledWith(delStub, path);
  });

});
