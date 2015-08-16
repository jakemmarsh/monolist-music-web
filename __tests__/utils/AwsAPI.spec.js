'use strict';

import request from 'superagent';
import AwsAPI  from '../../app/js/utils/AwsAPI';

describe('Util: AwsAPI', function() {

  beforeEach(function() {
    this.requestMock = sinon.mock(request);
  });

  it('should make a request to upload a new user image', function(done) {
    let userId = 1;
    let image = {};
    let path = 'upload/user/' + userId;

    this.requestMock.expects('post').withArgs(path);

    AwsAPI.uploadUserImage(image, userId);

    done();
  });

  it('should make a request to upload a new playlist image', function(done) {
    let playlistId = 1;
    let image = {};
    let path = 'upload/playlist/' + playlistId;
    let user = {};

    this.requestMock.expects('post').withArgs(path);

    AwsAPI.uploadPlaylistImage(image, user);

    done();
  });

  afterEach(function() {
    this.requestMock.restore();
  });

});