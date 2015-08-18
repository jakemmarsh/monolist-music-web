'use strict';

import request from 'superagent';
import AwsAPI  from '../../app/js/utils/AwsAPI';

describe('Util: AwsAPI', function() {

  beforeEach(function() {
    this.requestMock = sandbox.mock(request);
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

    this.requestMock.expects('post').withArgs(path);

    AwsAPI.uploadPlaylistImage(image, playlistId);

    done();
  });

  it('should make a request to upload a new group image', function(done) {
    let groupId = 1;
    let image = {};
    let path = 'upload/group/' + groupId;

    this.requestMock.expects('post').withArgs(path);

    AwsAPI.uploadGroupImage(image, groupId);

    done();
  });

});