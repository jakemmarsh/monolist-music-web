'use strict';

import React            from 'react';
import ReactDOM         from 'react-dom';
import TestUtils        from 'react-addons-test-utils';

import testHelpers      from '../../utils/testHelpers';
import copyObject       from '../../utils/copyObject';
import ProfileSubheader from '../../app/js/components/ProfileSubheader';
import UserActions      from '../../app/js/actions/UserActions';

describe('Component: ProfileSubheader', function() {

  const FIRST_USER = testHelpers.fixtures.user;
  const SECOND_USER = testHelpers.fixtures.secondUser;
  let props;
  let rendered;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <ProfileSubheader {...props} />
    );
  }

  beforeEach(function() {
    props = {};
  });

  it('should call action on follow click', function() {
    props.currentUser = FIRST_USER;
    props.profile = SECOND_USER;
    renderComponent();
    const button = ReactDOM.findDOMNode(rendered.refs.followButton);

    sandbox.stub(UserActions, 'follow');

    TestUtils.Simulate.click(button);

    sinon.assert.calledOnce(UserActions.follow);
    sinon.assert.calledWith(UserActions.follow, SECOND_USER);
  });

  describe('rendering follow button', function() {
    context('when currentUser does follow profile', function() {
      beforeEach(function() {
        props.currentUser = copyObject(FIRST_USER);
        props.profile = copyObject(SECOND_USER);
        props.profile.followers = [{ followerId: FIRST_USER.id }];
        renderComponent();
      });

      it('should pass correct props to action button', function() {
        const button = rendered.refs.followButton;

        assert.strictEqual(button.props.className, 'active-yellow');
        assert.strictEqual(button.props.icon, 'rss-square');
        assert.strictEqual(button.props.tooltip, 'Unfollow');
        assert.strictEqual(button.props.onClick, rendered.toggleFollowUser);
      });
    });

    context('when currentUser does not follow profile', function() {
      beforeEach(function() {
        props.currentUser = copyObject(FIRST_USER);
        props.profile = copyObject(SECOND_USER);
        renderComponent();
      });

      it('should pass correct props to action button', function() {
        const button = rendered.refs.followButton;

        assert.strictEqual(button.props.className, '');
        assert.strictEqual(button.props.icon, 'rss-square');
        assert.strictEqual(button.props.tooltip, 'Follow');
        assert.strictEqual(button.props.onClick, rendered.toggleFollowUser);
      });
    });
  });

});
