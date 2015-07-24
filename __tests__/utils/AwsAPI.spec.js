'use strict';

var request = require('superagent');
var AwsAPI   = require('../../app/js/utils/AwsAPI');

describe('Util: AwsAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(request);
  });

  it('should make a request to upload a new user image', function(done) {
    var userId = 1;
    var image = {};
    var path = 'upload/user/' + userId;

    mock.expects('post').withArgs(path);

    AwsAPI.uploadUserImage(image, userId);

    done();
  });

  it('should make a request to upload a new playlist image', function(done) {
    var playlistId = 1;
    var image = {};
    var path = 'upload/playlist/' + playlistId;
    var user = {};

    mock.expects('post').withArgs(path);

    AwsAPI.uploadPlaylistImage(image, user);

    done();
  });

  after(function() {
    mock.restore();
  });

});