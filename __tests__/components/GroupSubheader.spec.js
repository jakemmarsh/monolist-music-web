'use strict';

import React          from 'react';
import TestUtils      from 'react-addons-test-utils';
import _              from 'lodash';

import testHelpers    from '../../utils/testHelpers';
import copyObject     from '../../utils/copyObject';
import Modals         from '../../app/js/utils/Modals';
import GroupSubheader from '../../app/js/components/GroupSubheader';
import GroupActions   from '../../app/js/actions/GroupActions';

describe('Component: GroupSubheader', function() {

  const user = testHelpers.fixtures.user;
  const group = testHelpers.fixtures.group;
  let props;
  let rendered;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <GroupSubheader {...props} />
    );
  }

  function isUserMember(user) {
    return user && props.group && _.some(props.group.members, { id: user.id });
  }

  function getUserLevel(userToCheck) {
    let level = 0;

    if (props.group) {
      const userMembership = _.find(props.group.memberships, (membership) => { return membership.userId === userToCheck.id; });

      if ( props.group.ownerId === userToCheck.id ) {
        level = 3;
      } else {
        level = userMembership ? userMembership.level : 0;
      }
    }

    return level;
  }

  beforeEach(function() {
    props = {
      isUserMember: isUserMember,
      getUserLevel: getUserLevel
    };
  });

  describe('join/leave button', function() {
    context('when user is group owner', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        const newUser = copyObject(user);
        newGroup.owner = newUser;

        props.group = newGroup;
        props.currentUser = newUser;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.joinLeaveButton);
      });
    });

    context('when group is private and user is not member', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        newGroup.privacy = 'private';

        props.group = newGroup;
        props.currentUser = copyObject(user);

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.joinLeaveButton);
      });
    });

    context('when user is group owner', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        const newUser = copyObject(user);
        newGroup.owner = newUser;

        props.group = newGroup;
        props.currentUser = newUser;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.joinLeaveButton);
      });
    });

    context('when current user is member', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        const newUser = copyObject(user);
        newGroup.members.push(newUser);

        props.group = newGroup;
        props.currentUser = newUser;
        props.removeMember = sandbox.stub();

        renderComponent();
      });

      it('should render with correct icon', function() {
        const icon = rendered.refs.joinLeaveIcon;

        assert.isTrue(icon.classList.contains('icon-user-times'));
        assert.isFalse(icon.classList.contains('icon-user-plus'));
      });

      it('should call props.removeMember on click', function() {
        TestUtils.Simulate.click(rendered.refs.joinLeaveButton);

        sinon.assert.calledOnce(props.removeMember);
        sinon.assert.calledWith(props.removeMember, props.currentUser);
      });
    });

    context('when current user is not member', function() {
      beforeEach(function() {
        props.addMember = sandbox.stub();
        props.group = copyObject(group);
        props.currentUser = copyObject(user);

        renderComponent();
      });

      it('should render with correct icon', function() {
        const icon = rendered.refs.joinLeaveIcon;

        assert.isFalse(icon.classList.contains('icon-user-times'));
        assert.isTrue(icon.classList.contains('icon-user-plus'));
      });

      it('should call props.addMember on click', function() {
        TestUtils.Simulate.click(rendered.refs.joinLeaveButton);

        sinon.assert.calledOnce(props.addMember);
        sinon.assert.calledWith(props.addMember, props.currentUser);
      });
    });
  });

  describe('follow button', function() {
    context('when current user follows group', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        const newUser = copyObject(user);
        newGroup.followers.push({
          groupId: newGroup.id,
          followerId: newUser.id
        });

        props.group = newGroup;
        props.currentUser = newUser;

        renderComponent();
      });

      it('should render with "active-yellow" class', function() {
        assert.isTrue(rendered.refs.followButton.classList.contains('active-yellow'));
      });

      it('should call follow action on click', function() {
        sandbox.stub(GroupActions, 'follow');

        TestUtils.Simulate.click(rendered.refs.followButton);

        sinon.assert.calledOnce(GroupActions.follow);
        sinon.assert.calledWith(GroupActions.follow, props.group.id, props.currentUser);
      });
    });

    context('when current user does not follow group', function() {
      beforeEach(function() {
        props.group = copyObject(group);
        props.currentUser = copyObject(user);

        renderComponent();
      });

      it('should render without "active-yellow" class', function() {
        assert.isFalse(rendered.refs.followButton.classList.contains('active-yellow'));
      });

      it('should call follow action on click', function() {
        sandbox.stub(GroupActions, 'follow');

        TestUtils.Simulate.click(rendered.refs.followButton);

        sinon.assert.calledOnce(GroupActions.follow);
        sinon.assert.calledWith(GroupActions.follow, props.group.id, props.currentUser);
      });
    });
  });

  describe('manage members button', function() {
    context('when user is member and has invite permissions', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        const newUser = copyObject(user);
        newGroup.inviteLevel = 2;
        newGroup.memberships.push({
          userId: newUser.id,
          level: 2
        });
        newGroup.members.push(newUser);

        props.group = newGroup;
        props.currentUser = newUser;

        sandbox.stub(Modals, 'openUserSearch');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.manageMembersButton);
      });

      it('should open user search modal on click', function() {
        TestUtils.Simulate.click(rendered.refs.manageMembersButton);

        sinon.assert.calledOnce(Modals.openUserSearch);
        sinon.assert.calledWith(Modals.openUserSearch, props.group.members);
      });
    });

    context('when user is not member', function() {
      beforeEach(function() {
        props.group = copyObject(group);
        props.currentUser = copyObject(user);

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.manageMembersButton);
      });
    });

    context('when user is member without invite permissions', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        const newUser = copyObject(user);
        newGroup.inviteLevel = 2;
        newGroup.memberships.push({
          userId: newUser.id,
          level: 1
        });

        props.group = newGroup;
        props.currentUser = newUser;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.manageMembersButton);
      });
    });
  });

  describe('edit button', function() {
    context('when user is group owner', function() {
      beforeEach(function() {
        const newGroup = copyObject(group);
        const newUser = copyObject(user);
        newGroup.owner = newUser;

        props.group = newGroup;
        props.currentUser = newUser;

        sandbox.stub(Modals, 'openEditGroup');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.editButton);
      });

      it('should open edit group modal on click', function() {
        TestUtils.Simulate.click(rendered.refs.editButton);

        sinon.assert.calledOnce(Modals.openEditGroup);
        sinon.assert.calledWith(Modals.openEditGroup, props.group);
      });
    });

    context('when user is not group owner', function() {
      beforeEach(function() {
        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.editButton);
      });
    });
  });

});
