'use strict';

import APIUtils from '../../app/js/utils/APIUtils';
import TrackAPI from '../../app/js/utils/TrackAPI';

describe('Util: TrackAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to star a track', function(done) {
    let path = 'track/star';
    let track = {};

    this.apiUtilsMock.expects('post').withArgs(path, track);

    TrackAPI.star(track);

    done();
  });

  it('should make a request to upvote a track', function(done) {
    let trackId = 1;
    let path = 'track/' + trackId + '/upvote';
    let track = {};

    this.apiUtilsMock.expects('post').withArgs(path);

    TrackAPI.upvote(trackId);

    done();
  });

  it('should make a request to downvote a track', function(done) {
    let trackId = 1;
    let path = 'track/' + trackId + '/downvote';
    let track = {};

    this.apiUtilsMock.expects('post').withArgs(path);

    TrackAPI.downvote(trackId);

    done();
  });

  it('should make a request to add a comment', function(done) {
    let trackId = 1;
    let path = 'track/' + trackId + '/comment';
    let commentBody = '';

    this.apiUtilsMock.expects('post').withArgs(path, { body: commentBody });

    TrackAPI.addComment(trackId, commentBody);

    done();
  });

  it('should make a request to upvote a track', function(done) {
    let trackId = 1;
    let commentId = 1;
    let path = 'track/' + trackId + '/comment/' + commentId;

    this.apiUtilsMock.expects('del').withArgs(path);

    TrackAPI.removeComment(trackId, commentId);

    done();
  });

  afterEach(function() {
    this.apiUtilsMock.restore();
  });

});