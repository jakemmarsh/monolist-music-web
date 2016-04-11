'use strict';

import React            from 'react';
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

    sandbox.stub(UserActions, 'follow');

    TestUtils.Simulate.click(rendered.refs.followButton);

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

      it('should render with "active-yellow" class', function() {
        assert.isTrue(rendered.refs.followButton.classList.contains('active-yellow'));
      });
    });

    context('when currentUser does not follow profile', function() {
      beforeEach(function() {
        props.currentUser = copyObject(FIRST_USER);
        props.profile = copyObject(SECOND_USER);
        renderComponent();
      });

      it('should not render with "active-yellow" class', function() {
        assert.isFalse(rendered.refs.followButton.classList.contains('active-yellow'));
      });
    });
  });

});
