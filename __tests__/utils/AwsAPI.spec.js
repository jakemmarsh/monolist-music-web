'use strict';

import AwsAPI  from '../../app/js/utils/AwsAPI';

describe('Util: AwsAPI', function() {

  it('should make a request to upload a new user image', function(done) {
    let userId = 1;
    let image = {};
    let path = 'upload/user/' + userId;

    AwsAPI.uploadUserImage(image, userId);

    sinon.assert.calledOnce(postStub, path);

    done();
  });

  it('should make a request to upload a new playlist image', function(done) {
    let playlistId = 1;
    let image = {};
    let path = 'upload/playlist/' + playlistId;

    AwsAPI.uploadPlaylistImage(image, playlistId);

    sinon.assert.calledOnce(postStub, path);

    done();
  });

  it('should make a request to upload a new group image', function(done) {
    let groupId = 1;
    let image = {};
    let path = 'upload/group/' + groupId;

    AwsAPI.uploadGroupImage(image, groupId);

    sinon.assert.calledOnce(postStub, path);

    done();
  });

});