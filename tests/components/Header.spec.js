'use strict';

import React       from 'react';
import TestUtils   from 'react-addons-test-utils';

import TestHelpers from '../../utils/testHelpers';
import Header      from '../../app/js/components/Header';

describe('Component: Header', function() {

  const user = Object.freeze(TestHelpers.fixtures.user);
  let props;
  let rendered;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <Header {...props} />
    );
  }

  beforeEach(function() {
    props = {};
  });

  context('when there is no user', function() {
    beforeEach(function() {
      props.currrentUser = undefined;

      renderComponent();
    });

    it('should not render Create Playlist or Create Group links', function() {
      assert.isUndefined(rendered.refs.createPlaylistLink);
      assert.isUndefined(rendered.refs.createGroupLink);
    });

    it('should not render notifications or user dropdown', function() {
      assert.isUndefined(rendered.refs.notificationCenter);
      assert.isUndefined(rendered.refs.userActionDropdown);
    });

    it('should render register and login links', function() {
      assert.isDefined(rendered.refs.registerLink);
      assert.isDefined(rendered.refs.loginLink);
    });
  });

  context('when there is a user', function() {
    beforeEach(function() {
      props.currentUser = user;

      renderComponent();
    });

    it('should render Create Playlist and Create Group links', function() {
      assert.isDefined(rendered.refs.createPlaylistLink);
      assert.isDefined(rendered.refs.createGroupLink);
    });

    it('should render notifications and user dropdown', function() {
      assert.isDefined(rendered.refs.notificationCenter);
      assert.isDefined(rendered.refs.userActionDropdown);
    });

    it('should not render register or login links', function() {
      assert.isUndefined(rendered.refs.registerLink);
      assert.isUndefined(rendered.refs.loginLink);
    });
  });

  it('using the search bar should redirect to /search/playlists', function() {
    props.currentUser = user;
    renderComponent();

    const searchInput = rendered.refs.searchBar.refs.input;
    const history = {
      pushState: sandbox.stub()
    };
    rendered.history = history;

    TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });
    TestUtils.Simulate.keyPress(searchInput, { key: 'Enter', keyCode: 13, which: 13 });

    sinon.assert.calledWith(history.pushState, null, '/search/playlists', { q: 'test' });
  });

});
