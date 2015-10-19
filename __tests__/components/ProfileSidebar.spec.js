'use strict';

import TestUtils      from 'react-addons-test-utils';

import TestHelpers    from '../../utils/testHelpers';
import ProfileSidebar from '../../app/js/components/ProfileSidebar';
import UserActions    from '../../app/js/actions/UserActions';

describe('Component: ProfileSidebar', function() {

  let user = Object.freeze(TestHelpers.fixtures.user);

  it('#toggleFollowUser should flip the state and call the action', function() {
    let sidebar = TestHelpers.renderStubbedComponent(ProfileSidebar, { user: user, currentUser: { id: 2 } });

    sandbox.mock(UserActions).expects('follow').withArgs(user);
    sandbox.mock(sidebar).expects('setState').withArgs({
      currentUserDoesFollow: !sidebar.state.currentUserDoesFollow
    });

    sidebar.toggleFollowUser();
  });

  it('#renderFollowButton should only render the follow button if both users and exist and are not the same', function() {
    let sidebar = TestHelpers.renderStubbedComponent(ProfileSidebar, { user: user, currentUser: user });

    Should(sidebar.renderFollowButton()).be.undefined();

    sidebar = TestHelpers.renderStubbedComponent(ProfileSidebar, { user: user, currentUser: { id: 2 } });

    Should(sidebar.renderFollowButton()).not.be.undefined();
  });

  it('clicking the follow button should invoke #toggleFollowUser', function() {
    let sidebar = TestHelpers.renderStubbedComponent(ProfileSidebar, { user: user, currentUser: { id: 2 } });
    let followButton = sidebar.refs.followButton;

    sandbox.mock(sidebar).expects('toggleFollowUser').once();
    TestUtils.Simulate.click(followButton);
  });

});