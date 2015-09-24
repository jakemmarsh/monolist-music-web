'use strict';

import React           from 'react/addons';

import TestHelpers     from '../../utils/testHelpers';
import PlaylistSidebar from '../../app/js/components/PlaylistSidebar';
import PlaylistActions from '../../app/js/actions/PlaylistActions';

const  TestUtils       = React.addons.TestUtils;

describe('Component: PlaylistSidebar', function() {

  const playlist = TestHelpers.fixtures.playlist;

  it('#setPrivacyLevel should invoke the playlist update action', function() {
    const sidebar = TestUtils.renderIntoDocument(
      <PlaylistSidebar playlist={playlist} />
    );
    const newPrivacyLevel = 'private';

    sandbox.mock(PlaylistActions).expects('update').once().withArgs(playlist.id, {
      privacy: newPrivacyLevel
    });

    sidebar.setPrivacyLevel(newPrivacyLevel);
  });

});