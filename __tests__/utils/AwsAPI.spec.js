'use strict';

import request from 'superagent';
import AwsAPI  from '../../app/js/utils/AwsAPI';

describe('Util: AwsAPI', function() {

  it('should make a request to upload a new user image', function() {
    let userId = 1;
    let image = {};
    let path = 'upload/user/' + userId;

    sandbox.mock(request).expects('post').withArgs(path);

    AwsAPI.uploadUserImage(image, userId);
  });

  it('should make a request to upload a new playlist image', function() {
    let playlistId = 1;
    let image = {};
    let path = 'upload/playlist/' + playlistId;

    sandbox.mock(request).expects('post').withArgs(path);

    AwsAPI.uploadPlaylistImage(image, playlistId);
  });

  it('should make a request to upload a new group image', function() {
    let groupId = 1;
    let image = {};
    let path = 'upload/group/' + groupId;

    sandbox.mock(request).expects('post').withArgs(path);

    AwsAPI.uploadGroupImage(image, groupId);
  });

});