'use strict';

import TestUtils   from 'react-addons-test-utils';

import TestHelpers from '../../utils/testHelpers';
import CommentList from '../../app/js/components/CommentList';

describe('Component: CommentList', function() {

  const comments = [TestHelpers.fixtures.comment];
  const user = TestHelpers.fixtures.user;

  it('#handleKeyPress should call #postComment on enter', function(done) {
    const commentList = TestHelpers.renderStubbedComponent(CommentList, { comments: comments.slice(), currentUser: user });
    const commentInput = commentList.refs.commentInput;

    sandbox.mock(commentList).expects('postComment').once();
    TestUtils.Simulate.change(commentInput, { target: { value: 'test' } });
    TestUtils.Simulate.keyDown(commentInput, {key: 'Enter', keyCode: 13, which: 13});

    done();
  });

  it('#associateCommentId should add the ID to the correct comment', function(done) {
    const commentList = TestHelpers.renderStubbedComponent(CommentList, { comments: comments.slice() });
    const newId = 5;

    commentList.associateCommentId(null, { id: newId });
    commentList.state.comments[commentList.state.comments.length - 1].id.should.equal(newId);

    done();
  });

  it('#postComment should call props.postComment and update state', function(done) {
    const spy = sandbox.spy();
    const commentList = TestHelpers.renderStubbedComponent(CommentList, { comments: comments.slice(), postComment: spy });
    const newBody = 'new comment body';

    commentList.setState({ newCommentBody: newBody });
    commentList.postComment();
    commentList.state.comments[commentList.state.comments.length - 1].body.should.eql(newBody);

    sinon.assert.calledOnce(spy);
    spy.calledWith(newBody, commentList.associateCommentId).should.be.true();

    done();
  });

  it('#deleteComment should call props.deleteComment and update state', function() {
    const spy = sandbox.spy();
    const commentList = TestHelpers.renderStubbedComponent(CommentList, { comments: comments.slice(), deleteComment: spy });
    const commentId = comments[0].id;

    commentList.deleteComment(commentId);

    commentList.state.comments.should.eql([]);
    sinon.assert.calledWith(spy, commentId);
  });

});
