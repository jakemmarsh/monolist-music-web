'use strict';

var APIUtils = require('../../app/js/utils/APIUtils');
var TrackAPI = require('../../app/js/utils/TrackAPI');

describe('Util: TrackAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(APIUtils);
  });

  it('should make a request to star a track', function(done) {
    var path = 'track/star';
    var track = {};

    mock.expects('post').withArgs(path, track);

    TrackAPI.star(track);

    done();
  });

  it('should make a request to upvote a track', function(done) {
    var trackId = 1;
    var path = 'track/' + trackId + '/upvote';
    var track = {};

    mock.expects('post').withArgs(path);

    TrackAPI.upvote(trackId);

    done();
  });

  it('should make a request to downvote a track', function(done) {
    var trackId = 1;
    var path = 'track/' + trackId + '/downvote';
    var track = {};

    mock.expects('post').withArgs(path);

    TrackAPI.downvote(trackId);

    done();
  });

  it('should make a request to add a comment', function(done) {
    var trackId = 1;
    var path = 'track/' + trackId + '/comment';
    var commentBody = '';

    mock.expects('post').withArgs(path, { body: commentBody });

    TrackAPI.addComment(trackId, commentBody);

    done();
  });

  it('should make a request to upvote a track', function(done) {
    var trackId = 1;
    var commentId = 1;
    var path = 'track/' + trackId + '/comment/' + commentId;
    var track = {};

    mock.expects('del').withArgs(path);

    TrackAPI.removeComment(trackId, commentId);

    done();
  });

  after(function() {
    mock.restore();
  });

});