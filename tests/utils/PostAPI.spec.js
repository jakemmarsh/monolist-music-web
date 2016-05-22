'use strict';

import APIUtils    from '../../app/js/utils/APIUtils';
import PostAPI from '../../app/js/utils/PostAPI';

describe('Util: PostAPI', function() {

  it('#get should make a request to get a specific post', function() {
    const id = 1;
    const path = 'post/' + id;

    sandbox.stub(APIUtils, 'get');

    PostAPI.get(id);

    sinon.assert.calledOnce(APIUtils.get);
    sinon.assert.calledWith(APIUtils.get, path);
  });

  it('#create should make a request to create a new post', function() {
    const path = 'post';
    const post = {};

    sandbox.stub(APIUtils, 'post');

    PostAPI.create(post);

    sinon.assert.calledOnce(APIUtils.post);
    sinon.assert.calledWith(APIUtils.post, path, post);
  });

  it('should make a request to get newest posts', function() {
    const path = 'posts/newest';

    sandbox.stub(APIUtils, 'get');

    PostAPI.getNewest();

    sinon.assert.calledOnce(APIUtils.get);
    sinon.assert.calledWith(APIUtils.get, path);
  });

  it('should make a request to get newest posts for a group', function() {
    const groupId = 1;
    const path = 'group/' + groupId + '/posts';

    sandbox.stub(APIUtils, 'get');

    PostAPI.getNewestForGroup(groupId);

    sinon.assert.calledOnce(APIUtils.get);
    sinon.assert.calledWith(APIUtils.get, path);
  });

  it('should make a request to like a post', function() {
    const postId = 1;
    const path = 'post/' + postId + '/like';

    sandbox.stub(APIUtils, 'post');

    PostAPI.like(postId);

    sinon.assert.calledOnce(APIUtils.post);
    sinon.assert.calledWith(APIUtils.post, path);
  });

  it('should make a request to add a comment', function() {
    const postId = 1;
    const path = 'post/' + postId + '/comment';
    const comment = {};

    sandbox.stub(APIUtils, 'post');

    PostAPI.addComment(postId, comment);

    sinon.assert.calledOnce(APIUtils.post);
    sinon.assert.calledWith(APIUtils.post, path, comment);
  });

  it('should make a request to remove a comment', function() {
    const postId = 1;
    const commentId = 1;
    const path = 'post/' + postId + '/comment/' + commentId;

    sandbox.stub(APIUtils, 'del');

    PostAPI.removeComment(postId, commentId);

    sinon.assert.calledOnce(APIUtils.del);
    sinon.assert.calledWith(APIUtils.del, path);
  });

  it('should make a request to delete a post', function() {
    const postId = 1;
    const path = 'post/' + postId;

    sandbox.stub(APIUtils, 'del');

    PostAPI.delete(postId);

    sinon.assert.calledOnce(APIUtils.del);
    sinon.assert.calledWith(APIUtils.del, path);
  });

});
