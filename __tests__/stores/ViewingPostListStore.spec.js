'use strict';

import when                  from 'when';

import TestHelpers           from '../../utils/testHelpers';
import ViewingPostListStore  from '../../app/js/stores/ViewingPostListStore';
import GlobalActions         from '../../app/js/actions/GlobalActions';
import GroupActions          from '../../app/js/actions/GroupActions';
import PostActions           from '../../app/js/actions/PostActions';
import PostAPI               from '../../app/js/utils/PostAPI';

describe('Store: ViewingPostList', function() {

  let post = TestHelpers.fixtures.post;

  beforeEach(function() {
    this.postAPIMock = sandbox.mock(PostAPI);
  });

  it('should load all global posts on action', function(done) {
    this.postAPIMock.expects('getNewest').returns(when());

    GlobalActions.loadExplorePage();

    done();
  });

  it('should load all posts for a group on action', function(done) {
    this.postAPIMock.expects('getNewestForGroup').returns(when());

    GroupActions.open();

    done();
  });

  it('should create a new post on action', function(done) {
    this.postAPIMock.expects('create').withArgs(post).returns(when());

    PostActions.create(post);

    done();
  });

  it('should add a new comment to a post on action', function(done) {
    let commentBody = 'Test comment';
    let postId = 1;

    this.postAPIMock.expects('addComment').withArgs(postId, commentBody).returns(when());

    PostActions.addComment(postId, commentBody);

    done();
  });

  it('should remove a comment from a post on action', function(done) {
    let postId = 1;
    let commentId = 1;

    this.postAPIMock.expects('removeComment').withArgs(postId, commentId).returns(when());

    PostActions.removeComment(postId, commentId);

    done();
  });

  it('should delete a post on action', function(done) {
    let postId = 1;

    this.postAPIMock.expects('delete').withArgs(postId).returns(when());

    PostActions.delete(postId);

    done();
  });

});