'use strict';

import React       from 'react';
import TestUtils   from 'react-addons-test-utils';

import TestHelpers from '../../utils/testHelpers';
import copyObject  from '../../utils/copyObject';
import CommentList from '../../app/js/components/CommentList';

describe('Component: CommentList', function() {

  const COMMENTS = [TestHelpers.fixtures.comment];
  const USER = TestHelpers.fixtures.user;

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <CommentList {...props} />
    );
  }

  beforeEach(function() {
    props = {
      comments: COMMENTS.slice(),
      currentUser: copyObject(USER)
    };
  });

  it('#handleKeyPress should call #postComment on enter', function() {
    renderComponent();

    const commentInput = rendered.refs.commentInput;

    sandbox.stub(rendered, 'postComment');
    commentInput.value = 'test';
    TestUtils.Simulate.change(commentInput);
    TestUtils.Simulate.keyPress(commentInput, { key: 'Enter', keyCode: 13, which: 13 });

    sinon.assert.calledOnce(rendered.postComment);
  });

  it('#associateCommentId should add the ID to the correct comment', function() {
    renderComponent();

    const newId = 5;

    rendered.associateCommentId(null, { id: newId });
    rendered.state.comments[rendered.state.comments.length - 1].id.should.equal(newId);
  });

  it('#postComment should call props.postComment and update state', function() {
    props.postComment = sandbox.stub();
    renderComponent();

    const newBody = 'new comment body';
    const commentInput = rendered.refs.commentInput;

    commentInput.value = newBody;
    TestUtils.Simulate.change(commentInput);
    rendered.postComment();

    sinon.assert.calledOnce(props.postComment);
    sinon.assert.calledWith(props.postComment, newBody, rendered.associateCommentId);
  });

  it('#deleteComment should call props.deleteComment and update state', function() {
    props.deleteComment = sandbox.stub();
    renderComponent();

    const commentId = props.comments[0].id;

    rendered.deleteComment(commentId);

    sinon.assert.calledOnce(props.deleteComment);
    sinon.assert.calledWith(props.deleteComment, commentId);
  });

});
