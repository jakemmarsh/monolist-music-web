'use strict';

import when     from 'when';
import lscache  from 'lscache';

import APIUtils from '../../app/js/utils/APIUtils';
import TrackAPI from '../../app/js/utils/TrackAPI';

describe('Util: TrackAPI', function() {

  describe('#getTrackDetails', function() {
    const details = { title: 'test', source: 'youtube' };

    context('when key doesn\'t exist in cache', function() {
      beforeEach(function() {
        sandbox.stub(lscache, 'get').returns(null);
      });

      it('should make a request to get details about a track by URL and store in cache', function(done) {
        const url = 'https://www.youtube.com/watch?v=eLwHD6ae5Sc';
        const source = 'youtube';
        const path = 'details/' + source + '/' + encodeURIComponent(url);
        const key = `trackDetails:${source}:${url}`;
        const getStub = sandbox.stub(APIUtils, 'get').returns(when(details));
        const setStub = sandbox.stub(lscache, 'set');

        TrackAPI.getTrackDetails(source, url).then(() => {
          sinon.assert.calledWith(getStub, path);
          sinon.assert.calledWith(setStub, key, details);
          done();
        });
      });
    });

    context('when key does exist in cache', function() {
      it('should retrieve the details from the cache', function(done) {
        const url = 'https://www.youtube.com/watch?v=eLwHD6ae5Sc';
        const source = 'youtube';
        const key = `trackDetails:${source}:${url}`;
        const getStub = sandbox.stub(lscache, 'get').withArgs(key).returns(details);

        TrackAPI.getTrackDetails(source, url).then((returnedDetails) => {
          sinon.assert.calledOnce(getStub);
          returnedDetails.should.eql(details);
          done();
        });
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