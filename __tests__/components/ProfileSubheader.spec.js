'use strict';

import React            from 'react';
import TestUtils        from 'react-addons-test-utils';

import testHelpers      from '../../utils/testHelpers';
import copyObject       from '../../utils/copyObject';
import ProfileSubheader from '../../app/js/components/ProfileSubheader';
import UserActions      from '../../app/js/actions/UserActions';

describe('Component: ProfileSubheader', function() {

  const firstUser = testHelpers.fixtures.user;
  const secondUser = testHelpers.fixtures.secondUser;
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

  it('should update state and call action on follow click', function() {
    props.currentUser = firstUser;
    props.profile = secondUser;
    renderComponent();

    sandbox.stub(UserActions, 'follow');

    TestUtils.Simulate.click(rendered.refs.followButton);

    return Promise.resolve().then(function() {
      sinon.assert.calledOnce(UserActions.follow);
      sinon.assert.calledWith(UserActions.follow, secondUser);
    });
  });

  describe('rendering follow button', function() {
    context('when currentUser does follow profile', function() {
      beforeEach(function() {
        props.currentUser = copyObject(firstUser);
        props.profile = copyObject(secondUser);
        props.profile.followers = [{ followerId: firstUser.id }];
        renderComponent();
      });

      it('should render with "active-yellow" class', function() {
        assert.isTrue(rendered.refs.followButton.classList.contains('active-yellow'));
      });
    });

    context('when currentUser does not follow profile', function() {
      beforeEach(function() {
        props.currentUser = copyObject(firstUser);
        props.profile = copyObject(secondUser);
        renderComponent();
      });

      it('should not render with "active-yellow" class', function() {
        assert.isFalse(rendered.refs.followButton.classList.contains('active-yellow'));
      });
    });
  });

});
