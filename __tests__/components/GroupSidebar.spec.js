'use strict';

import React        from 'react/addons';

import TestHelpers  from '../../utils/testHelpers';
import GroupSidebar from '../../app/js/components/GroupSidebar';
import GroupActions from '../../app/js/actions/GroupActions';

const  TestUtils    = React.addons.TestUtils;

describe('Component: GroupSidebar', function() {

  const group = TestHelpers.fixtures.group;

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

});