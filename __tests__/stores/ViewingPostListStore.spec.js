'use strict';

import when                       from 'when';

import TestHelpers                from '../../utils/testHelpers';
import ViewingPostListStore       from '../../app/js/stores/ViewingPostListStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import GroupActions               from '../../app/js/actions/GroupActions';
import PostActions                from '../../app/js/actions/PostActions';
import PostAPI                    from '../../app/js/utils/PostAPI';

describe('Store: ViewingPostList', function() {

  let post = JSON.parse(JSON.stringify(TestHelpers.fixtures.post));

  it('should load all global posts on action', function(done) {
    const getNewestStub = sandbox.stub(PostAPI, 'getNewest').returns(when([post]));

    GlobalActions.loadExplorePosts(() => {
      sinon.assert.calledOnce(getNewestStub);
      done();
    });
  });

  it('should load all posts for a group on action', function(done) {
    const groupId = 1;
    const getNewestStub = sandbox.stub(PostAPI, 'getNewestForGroup').returns(when());

    GroupActions.loadPosts(groupId, () => {
      sinon.assert.calledOnce(getNewestStub);
      sinon.assert.calledWith(getNewestStub, groupId);
      done();
    });
  });

  it('should create a new post on action', function(done) {
    const createStub = sandbox.stub(PostAPI, 'create').returns(when());

    PostActions.create(post, () => {
      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, post);
      done();
    });
  });

  it('should add a new comment to a post on action', function(done) {
    const commentBody = 'Test comment';
    const addCommentStub = sandbox.stub(PostAPI, 'addComment').returns(when());

    PostActions.addComment(post.id, commentBody, () => {
      sinon.assert.calledOnce(addCommentStub);
      sinon.assert.calledWith(addCommentStub, post.id, commentBody);
      done();
    });
  });

  it('should remove a comment from a post on action', function(done) {
    const commentId = 1;
    const removeCommentStub = sandbox.stub(PostAPI, 'removeComment').returns(when());

    PostActions.removeComment(post.id, commentId, () => {
      sinon.assert.calledOnce(removeCommentStub);
      sinon.assert.calledWith(removeCommentStub, post.id, commentId);
      done();
    });
  });

  it('should delete a post on action', function(done) {
    const deleteStub = sandbox.stub(PostAPI, 'delete').returns(when());

    PostActions.delete(post.id, () => {
      sinon.assert.calledOnce(deleteStub);
      done();
    });
  });

});