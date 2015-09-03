'use strict';

import when             from 'when';

import ViewingPostStore from '../../app/js/stores/ViewingPostStore';
import PostActions      from '../../app/js/actions/PostActions';
import PostAPI          from '../../app/js/utils/PostAPI';
import TestHelpers      from '../../utils/testHelpers';

describe('Store: ViewingPost', function() {

  let post = TestHelpers.fixtures.post;

  beforeEach(function() {
    this.postAPIMock = sandbox.mock(PostAPI);
    ViewingPostStore.post = TestHelpers.fixtures.post;
  });

  it('should load a specific playlist on action', function(done) {
    this.postAPIMock.expects('get').withArgs(post.id).returns(when(post));

    PostActions.open(post.id);

    done();
  });

  it('should add a new comment to a post on action', function(done) {
    let commentBody = 'Test comment';

    this.postAPIMock.expects('addComment').withArgs(post.id, commentBody).returns(when());

    PostActions.addCommentViewing(commentBody);

    done();
  });

  it('should remove a comment from a post on action', function(done) {
    let commentId = 1;

    this.postAPIMock.expects('removeComment').withArgs(post.id, commentId).returns(when());

    PostActions.removeCommentViewing(commentId);

    done();
  });

  it('should delete a post on action', function(done) {
    this.postAPIMock.expects('delete').withArgs(post.id).returns(when());

    PostActions.deleteViewing();

    done();
  });

});