'use strict';

import request from 'superagent';
import AwsAPI  from '../../app/js/utils/AwsAPI';

describe('Util: AwsAPI', function() {

  it('should make a request to upload a new user image', function() {
    const userId = 1;
    const image = {};
    const path = 'upload/user/' + userId;

    sandbox.mock(request).expects('post').withArgs(path);

    AwsAPI.uploadUserImage(image, userId);
  });

  it('should make a request to upload a new playlist image', function() {
    const playlistId = 1;
    const image = {};
    const path = 'upload/playlist/' + playlistId;

    sandbox.mock(request).expects('post').withArgs(path);

    AwsAPI.uploadPlaylistImage(image, playlistId);
  });

  it('should make a request to upload a new group image', function() {
    const groupId = 1;
    const image = {};
    const path = 'upload/group/' + groupId;

    sandbox.mock(request).expects('post').withArgs(path);

    AwsAPI.uploadGroupImage(image, groupId);
  });

});
