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

  context('when initializing state', function() {
    context('when currentUser does follow profile', function() {
      beforeEach(function() {
        props.currentUser = copyObject(firstUser);
        props.profile = copyObject(secondUser);
        props.profile.followers = [{ followerId: firstUser.id }];
        renderComponent();
      });

      it('should set state.currentUserDoesFollow to true', function() {
        assert.isTrue(rendered.state.currentUserDoesFollow);
      });
    });

    context('when currentUser does not follow profile', function() {
      beforeEach(function() {
        props.currentUser = copyObject(firstUser);
        props.profile = copyObject(secondUser);
        renderComponent();
      });

      it('should set state.currentUserDoesFollow to false', function() {
        assert.isFalse(rendered.state.currentUserDoesFollow);
      });
    });
  });

  context('when receiving props', function() {
    beforeEach(function() {
      props.currentUser = copyObject(firstUser);
      props.profile = copyObject(secondUser);
      renderComponent();
      sinon.spy(rendered, 'setState');
    });

    context('when new user is the same', function() {
      beforeEach(function() {
        rendered.componentWillReceiveProps({
          currentUser: props.currentUser,
          profile: props.profile
        });
      });

      it('should not do anything', function() {
        sinon.assert.notCalled(rendered.setState);
      });
    });

    context('when new user is different', function() {
      context('when currentUser does follow new profile', function() {
        beforeEach(function() {
          const newProfile = copyObject(secondUser);
          newProfile.followers = [{ followerId: firstUser.id }];

          rendered.componentWillReceiveProps({
            currentUser: props.currentUser,
            profile: newProfile
          });
        });

        it('should set state.currentUserDoesFollow to true', function() {
          sinon.assert.calledOnce(rendered.setState);
          assert.isTrue(rendered.state.currentUserDoesFollow);
        });
      });

      context('when currentUser does not follow new profile', function() {
        beforeEach(function() {
          const newProfile = copyObject(secondUser);
          newProfile.followers = [{ followerId: 5 }];

          rendered.componentWillReceiveProps({
            currentUser: props.currentUser,
            profile: newProfile
          });
        });

        it('should set state.currentUserDoesFollow to false', function() {
          sinon.assert.calledOnce(rendered.setState);
          assert.isFalse(rendered.state.currentUserDoesFollow);
        });
      });
    });
  });

  it('should update state and call action on follow click', function() {
    props.currentUser = firstUser;
    props.profile = secondUser;
    renderComponent();

    sinon.spy(rendered, 'setState');
    sinon.stub(UserActions, 'follow');

    TestUtils.Simulate.click(rendered.refs.followButton);

    return Promise.resolve().then(function() {
      sinon.assert.calledOnce(rendered.setState);
      sinon.assert.calledWith(rendered.setState, {
        currentUserDoesFollow: true
      });
      sinon.assert.calledOnce(UserActions.follow);
      sinon.assert.calledWith(UserActions.follow, secondUser);
    });
  });

  context('rendering follow button', function() {
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
