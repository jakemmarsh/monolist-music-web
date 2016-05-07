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

  it('submitting the form should call props.postComment', function() {
    props.postComment = sandbox.stub();
    renderComponent();

    rendered.refs.commentInput.value = 'test';
    TestUtils.Simulate.change(rendered.refs.commentInput);
    TestUtils.Simulate.submit(rendered.refs.commentForm);

    sinon.assert.calledOnce(props.postComment);
    sinon.assert.calledWith(props.postComment, 'test');
  });

  it('#deleteComment should call props.deleteComment', function() {
    props.deleteComment = sandbox.stub();
    renderComponent();

    const commentId = props.comments[0].id;

    rendered.deleteComment(commentId);

    sinon.assert.calledOnce(props.deleteComment);
    sinon.assert.calledWith(props.deleteComment, commentId);
  });

});
