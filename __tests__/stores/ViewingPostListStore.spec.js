'use strict';

import when                       from 'when';

import TestHelpers                from '../../utils/testHelpers';
import ViewingPostListStore       from '../../app/js/stores/ViewingPostListStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import GroupActions               from '../../app/js/actions/GroupActions';
import PostActions                from '../../app/js/actions/PostActions';
import PostAPI                    from '../../app/js/utils/PostAPI';
import Mixpanel                   from '../../app/js/utils/Mixpanel';

describe('Store: ViewingPostList', function() {

  const post = JSON.parse(JSON.stringify(TestHelpers.fixtures.post));

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

  it('should create a new post on action and log event', function(done) {
    const createStub = sandbox.stub(PostAPI, 'create').returns(when(post));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PostActions.create(post, () => {
      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, post);
      sinon.assert.calledWith(mixpanelStub, 'create post', {
        post: post
      });
      done();
    });
  });

  it('should add a new comment to a post on action and log event', function(done) {
    const commentBody = 'Test comment';
    const addCommentStub = sandbox.stub(PostAPI, 'addComment').returns(when({ id: 1, body: commentBody }));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    ViewingPostListStore.posts = [post];

    PostActions.addComment(post.id, commentBody, () => {
      sinon.assert.calledOnce(addCommentStub);
      sinon.assert.calledWith(addCommentStub, post.id, commentBody);
      sinon.assert.calledWith(mixpanelStub, 'add post comment', {
        postId: post.id,
        comment: commentBody
      });
      done();
    });
  });

  it('should remove a comment from a post on action and log event', function(done) {
    const commentId = 1;
    const removeCommentStub = sandbox.stub(PostAPI, 'removeComment').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    ViewingPostListStore.posts = [post];

    PostActions.removeComment(post.id, commentId, () => {
      sinon.assert.calledOnce(removeCommentStub);
      sinon.assert.calledWith(removeCommentStub, post.id, commentId);
      sinon.assert.calledWith(mixpanelStub, 'remove post comment', {
        postId: post.id,
        commentId: commentId
      });
      done();
    });
  });

  it('should delete a post on action and log event', function(done) {
    const deleteStub = sandbox.stub(PostAPI, 'delete').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PostActions.delete(post.id, () => {
      sinon.assert.calledOnce(deleteStub);
      sinon.assert.calledWith(mixpanelStub, 'delete post', {
        postId: post.id
      });
      done();
    });
  });

});