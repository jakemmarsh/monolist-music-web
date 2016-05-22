'use strict';

import React       from 'react';
import ReactDOM    from 'react-dom';
import TestUtils   from 'react-addons-test-utils';
import moment      from 'moment';

import testHelpers from '../../utils/testHelpers';
import copyObject  from '../../utils/copyObject';
import Comment     from '../../app/js/components/Comment';

describe('Component: Comment', function() {

  const comment = copyObject(testHelpers.fixtures.comment);
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <Comment {...props} />
    );
  }

  beforeEach(function() {
    props = {
      comment: comment
    };
  });

  it('should have a link to the poster\'s profile', function() {
    renderComponent();
    const link = ReactDOM.findDOMNode(rendered.refs.authorLink);

    link.textContent.should.eql(comment.user.username);
  });

  it('should have the text body', function() {
    renderComponent();

    rendered.refs.body.textContent.should.eql(comment.body);
  });

  it('should have the formatted post time', function() {
    renderComponent();

    rendered.refs.timestamp.textContent.should.eql(moment(comment.createdAt).fromNow());
  });

  it('should render the delete button if current user is the poster', function() {
    props.currentUser = props.comment.user;
    renderComponent();

    TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'delete-button').length.should.equal(1);
  });

  it('#deleteComment should call props.deleteComment', function() {
    props.deleteComment = sandbox.stub();
    renderComponent();

    rendered.deleteComment();
    sinon.assert.calledOnce(props.deleteComment);
  });

});
