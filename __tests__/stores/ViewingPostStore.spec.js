'use strict';

import ViewingPostStore from '../../app/js/stores/ViewingPostStore';
import PostActions      from '../../app/js/actions/PostActions';
import PostAPI          from '../../app/js/utils/PostAPI';
import TestHelpers      from '../../utils/testHelpers';

describe('Store: ViewingPost', function() {

  const post = TestHelpers.fixtures.post;

  beforeEach(function() {
    ViewingPostStore.post = TestHelpers.fixtures.post;
  });

  it('should load a specific post on action', function(done) {
    const getStub = sandbox.stub(PostAPI, 'get').resolves(post);

    PostActions.open(post.id, () => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, post.id);
      done();
    });
  });

  it('should add a new comment to a post on action', function(done) {
    const commentBody = 'Test comment';
    const addCommentStub = sandbox.stub(PostAPI, 'addComment').resolves();

    PostActions.addCommentViewing(commentBody, () => {
      sinon.assert.calledOnce(addCommentStub);
      sinon.assert.calledWith(addCommentStub, post.id, commentBody);
      done();
    });
  });

  it('should remove a comment from a post on action', function(done) {
    const commentId = 1;
    const removeCommentStub = sandbox.stub(PostAPI, 'removeComment').resolves();

    PostActions.removeCommentViewing(commentId, () => {
      sinon.assert.calledOnce(removeCommentStub);
      sinon.assert.calledWith(removeCommentStub, post.id, commentId);
      done();
    });
  });

  it('should delete a post on action', function(done) {
    const deleteStub = sandbox.stub(PostAPI, 'delete').resolves();

    PostActions.deleteViewing(() => {
      sinon.assert.calledOnce(deleteStub);
      done();
    });
  });

});
