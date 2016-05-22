'use strict';

import request     from 'superagent';

import AwsAPI      from '../../app/js/utils/AwsAPI';
import testHelpers from '../../utils/testHelpers';

describe('Util: AwsAPI', function() {

  it('should make a request to upload a new user image', function() {
    const userId = 1;
    const image = {};
    const path = 'upload/user/' + userId;

    AwsAPI.uploadUserImage(image, userId);

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWith(request.post, testHelpers.stringThatContains(path));
  });

  it('should make a request to upload a new playlist image', function() {
    const playlistId = 1;
    const image = {};
    const path = 'upload/playlist/' + playlistId;

    AwsAPI.uploadPlaylistImage(image, playlistId);

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWith(request.post, testHelpers.stringThatContains(path));
  });

  it('should make a request to upload a new group image', function() {
    const groupId = 1;
    const image = {};
    const path = 'upload/group/' + groupId;

    AwsAPI.uploadGroupImage(image, groupId);

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWith(request.post, testHelpers.stringThatContains(path));
  });

});
