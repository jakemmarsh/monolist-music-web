'use strict';

import ReactDOM    from 'react-dom';
import TestUtils   from 'react-addons-test-utils';
import moment      from 'moment';

import TestHelpers from '../../utils/testHelpers';
import Comment     from '../../app/js/components/Comment';

describe('Component: Comment', function() {

  const comment = TestHelpers.fixtures.comment;

  it('should have a link to the poster\'s profile', function() {
    const commentComponent = TestHelpers.renderStubbedComponent(Comment, { comment: comment });
    const link = ReactDOM.findDOMNode(commentComponent.refs.authorLink);

    link.textContent.should.eql(comment.user.username);
  });

  it('should have the text body', function() {
    const commentComponent = TestHelpers.renderStubbedComponent(Comment, { comment: comment });

    commentComponent.refs.body.textContent.should.eql(comment.body);
  });

  it('should have the formatted post time', function() {
    const commentComponent = TestHelpers.renderStubbedComponent(Comment, { comment: comment });

    commentComponent.refs.timestamp.textContent.should.eql(moment(comment.createdAt).fromNow());
  });

  it('should render the delete button if current user is the poster', function() {
    const commentComponent = TestHelpers.renderStubbedComponent(Comment, { comment: comment, currentUser: comment.user });

    TestUtils.scryRenderedDOMComponentsWithClass(commentComponent, 'delete-button').length.should.equal(1);
  });

  it('#deleteComment should call props.deleteComment', function() {
    const spy = sandbox.spy();
    const commentComponent = TestHelpers.renderStubbedComponent(Comment, { comment: comment, deleteComment: spy });

    commentComponent.deleteComment();
    sinon.assert.calledOnce(spy);
  });

});
