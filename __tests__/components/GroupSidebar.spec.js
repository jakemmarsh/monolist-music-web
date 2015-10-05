'use strict';

import React        from 'react/addons';

import TestHelpers  from '../../utils/testHelpers';
import GroupSidebar from '../../app/js/components/GroupSidebar';
import GroupActions from '../../app/js/actions/GroupActions';

const  TestUtils    = React.addons.TestUtils;

describe('Component: GroupSidebar', function() {

  const group = TestHelpers.fixtures.group;
  const user = TestHelpers.fixtures.user;

  it('#isUserSelected should invoke props.isUserSelected', function() {
    const spy = sinon.spy();
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} isUserSelected={spy} />
    );

    sidebar.isUserSelected(user);

    sinon.assert.calledWith(spy, user);
  });

  it('#selectUser should invoke props.selectUser', function() {
    const spy = sinon.spy();
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} selectUser={spy} />
    );

    sidebar.selectUser(user);

    sinon.assert.calledWith(spy, user);
  });

  it('#deselectUser should invoke props.deselectUser', function() {
    const spy = sinon.spy();
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} deselectUser={spy} />
    );

    sidebar.deselectUser(user);

    sinon.assert.calledWith(spy, user);
  });

  it('#componentWillReceiveProps should update state if a new group is received', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} currentUser={user} />
    );
    const newGroup = {
      id: 2,
      members: [{ id: user.id }],
      followers: [{ userId: user.id }]
    };

    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserIsMember: true,
      currentUserDoesFollow: true
    });

    sidebar.componentWillReceiveProps({
      group: newGroup,
      currentUser: user
    });
  });

  it('#setPrivacyLevel should invoke the group update action', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} />
    );
    const newPrivacyLevel = 'private';

    sandbox.mock(GroupActions).expects('update').once().withArgs(group.id, {
      privacy: newPrivacyLevel
    });

    sidebar.setPrivacyLevel(newPrivacyLevel);
  });

  it('#toggleGroupMembership should flip membership state and call the action if user now follows', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} currentUser={user} />
    );

    sidebar.setState({ currentUserIsMember: false });
    sandbox.mock(GroupActions).expects('addMember').withArgs(group.id, user).once();
    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserIsMember: true
    });

    sidebar.toggleGroupMembership();
  });

  it('#toggleGroupMembership should flip membership state and call the action if user no longer follows', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} currentUser={user} />
    );

    sidebar.setState({ currentUserIsMember: true });
    sandbox.mock(GroupActions).expects('removeMember').withArgs(group.id, user).once();
    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserIsMember: false
    });

    sidebar.toggleGroupMembership();
  });

  it('#toggleFollowGroup should flip following state and call the action', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} currentUser={user} />
    );

    sidebar.setState({ currentUserDoesFollow: false });
    sandbox.mock(GroupActions).expects('follow').withArgs(group.id).once();
    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserDoesFollow: true
    });

    sidebar.toggleFollowGroup();
  });

  it('#renderJoinLeaveButton should only return an element if both user and group exist and not private', function() {

  });

  it('#renderFollowButton should only return an element if both user and group exist and user isn\'t member', function() {

  });

  it('renderManageMembersButton should only return an element if user is member and meets invite level threshold', function() {

  });

  it('clicking join/leave button should invoke #toggleGroupMembership', function() {
    const newUser = user;
    newUser.id = 2;
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group} currentUser={newUser} />
    );
    const joinLeaveButton = sidebar.refs.joinLeaveButton.getDOMNode();

    sandbox.mock(sidebar).expects('toggleGroupMembership').once();

    TestUtils.Simulate.click(joinLeaveButton);
  });

  it('clicking follow button should invoke #toggleFollowGroup', function() {
    const isUserSelectedStub = sandbox.stub().returns(true);
    const userLevelStub = sandbox.stub().returns(3);
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group}
                    currentUser={user}
                    isUserSelected={isUserSelectedStub}
                    getUserLevel={userLevelStub} />
    );
    const followButton = sidebar.refs.followButton.getDOMNode();

    sandbox.mock(sidebar).expects('toggleFollowGroup').once();

    TestUtils.Simulate.click(followButton);
  });

  it('clicking manage members button should invoke #toggleUserSearchModal', function() {
    const isUserSelectedStub = sandbox.stub().returns(true);
    const userLevelStub = sandbox.stub().returns(3);
    const sidebar = TestUtils.renderIntoDocument(
      <GroupSidebar group={group}
                    currentUser={user}
                    isUserSelected={isUserSelectedStub}
                    getUserLevel={userLevelStub} />
    );
    const manageMembersButton = sidebar.refs.manageMembersButton.getDOMNode();

    sandbox.mock(sidebar).expects('toggleUserSearchModal').once();

    TestUtils.Simulate.click(manageMembersButton);
  });

});