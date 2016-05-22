'use strict';

import testHelpers      from '../../utils/testHelpers';
import copyObject       from '../../utils/copyObject';
import ViewingPostStore from '../../app/js/stores/ViewingPostStore';
import PostActions      from '../../app/js/actions/PostActions';
import PostAPI          from '../../app/js/utils/PostAPI';

describe('Store: ViewingPost', function() {

  const POST = testHelpers.fixtures.post;

  beforeEach(function() {
    ViewingPostStore.post = copyObject(POST);
  });

  it('should load a specific post on action', function(done) {
    sandbox.stub(PostAPI, 'get').resolves(POST);

    sandbox.stub(ViewingPostStore, 'trigger', () => {
      sinon.assert.calledOnce(PostAPI.get);
      sinon.assert.calledWith(PostAPI.get, POST.id);
      done();
    });

    PostActions.open(POST.id);
  });

  it('should add a new comment to a post on action', function(done) {
    const commentBody = 'Test comment';

    sandbox.stub(PostAPI, 'addComment').resolves();

    sandbox.stub(ViewingPostStore, 'trigger', () => {
      sinon.assert.calledOnce(PostAPI.addComment);
      sinon.assert.calledWith(PostAPI.addComment, POST.id, commentBody);
      done();
    });

    PostActions.addCommentViewing(commentBody);
  });

  it('should remove a comment from a post on action', function(done) {
    const commentId = 1;

    sandbox.stub(PostAPI, 'removeComment').resolves();

    sandbox.stub(ViewingPostStore, 'trigger', () => {
      sinon.assert.calledOnce(PostAPI.removeComment);
      sinon.assert.calledWith(PostAPI.removeComment, POST.id, commentId);
      done();
    });

    PostActions.removeCommentViewing(commentId);
  });

  it('should delete a post on action', function(done) {
    sandbox.stub(PostAPI, 'delete').resolves();

    sandbox.stub(ViewingPostStore, 'trigger', () => {
      sinon.assert.calledOnce(PostAPI.delete);
      done();
    });

    PostActions.deleteViewing();
  });

});
