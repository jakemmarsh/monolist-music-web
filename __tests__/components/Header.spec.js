'use strict';

import TestUtils   from 'react-addons-test-utils';

import TestHelpers from '../../utils/testHelpers';
import Header      from '../../app/js/components/Header';

describe('Component: Header', function() {

  const user = Object.freeze(TestHelpers.fixtures.user);

  it('should not render notifications or user dropdown if there is no currentUser', function() {
    const header = TestHelpers.renderStubbedComponent(Header, { currentUser: {} });

    assert.isUndefined(header.refs.notificationCenter);
    assert.isUndefined(header.refs.userActionDropdown);
  });

  it('should render notifications or user dropdown if there is a currentUser', function() {
    const header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });

    assert.isDefined(header.refs.notificationCenter);
    assert.isDefined(header.refs.userActionDropdown);
  });

  it('using the search bar should redirect to /search/playlists', function() {
    const header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });
    const searchInput = header.refs.searchBar.refs.input;
    const history = {
      pushState: sandbox.stub()
    };

    header.history = history;
    TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });

    header.doGlobalSearch();

    sinon.assert.calledWith(history.pushState, null, '/search/playlists', { q: 'test' });
  });

});
