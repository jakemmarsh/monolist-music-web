'use strict';

import APIUtils    from '../../app/js/utils/APIUtils';
import PostAPI from '../../app/js/utils/PostAPI';

describe('Util: PostAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to get a specific post', function(done) {
    let id = 1;
    let path = 'post/' + id;

    this.apiUtilsMock.expects('get').withArgs(path);

    PostAPI.get(id);

    done();
  });

  it('should make a request to create a new post', function(done) {
    let path = 'post';
    let post = {};

    this.apiUtilsMock.expects('post').withArgs(path, post);

    PostAPI.create(post);

    done();
  });

  it('should make a request to get newest posts', function(done) {
    let path = 'posts/newest';

    this.apiUtilsMock.expects('get').withArgs(path);

    PostAPI.getNewest();

    done();
  });

  it('should make a request to get newest posts for a group', function(done) {
    let groupId = 1;
    let path = 'group/' + groupId + '/posts';

    this.apiUtilsMock.expects('get').withArgs(path);

    PostAPI.getNewestForGroup(groupId);

    done();
  });

  it('should make a request to like a post', function(done) {
    let postId = 1;
    let path = 'post/' + postId + '/like';

    this.apiUtilsMock.expects('post').withArgs(path);

    PostAPI.like(postId);

    done();
  });

  it('should make a request to add a comment', function(done) {
    let postId = 1;
    let path = 'post/' + postId + '/comment';
    let comment = {};

    this.apiUtilsMock.expects('post').withArgs(path, comment);

    PostAPI.addComment(postId, comment);

    done();
  });

  it('should make a request to remove a comment', function(done) {
    let postId = 1;
    let commentId = 1;
    let path = 'post/' + postId + '/comment/' + commentId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PostAPI.removeComment(postId, commentId);

    done();
  });

  it('should make a request to delete a post', function(done) {
    let postId = 1;
    let path = 'post/' + postId;

    this.apiUtilsMock.expects('del').withArgs(path);

    PostAPI.delete(postId);

    done();
  });

});