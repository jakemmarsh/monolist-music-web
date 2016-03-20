'use strict';

import ReactDOM          from 'react-dom';
import {ListenerMixin}   from 'reflux';

import TestHelpers       from '../../utils/testHelpers';
import GroupPage         from '../../app/js/pages/GroupPage';
import GroupActions      from '../../app/js/actions/GroupActions';
import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore';

describe('Page: Group', function() {

  const group = TestHelpers.fixtures.group;
  const user = TestHelpers.fixtures.user;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingGroupStore and load group on mount
    sandbox.mock(ListenerMixin).expects('listenTo').atLeast(1);
    sandbox.mock(GroupActions).expects('open').withArgs(group.slug);

    TestHelpers.testPage('/group/' + group.slug, { slug: group.slug }, {}, {}, GroupPage, this.container, (component) => {
      this.page = component;
      this.page.setState({ group: JSON.parse(JSON.stringify(group)) });
      ListenerMixin.listenTo.restore();
      GroupActions.open.restore();
      done();
    });
  });

  it('should call _onViewingGroupChange when store is triggered', function() {
    sandbox.mock(this.page).expects('_onViewingGroupChange').once();
    sandbox.stub(GroupActions, 'loadPosts');

    ViewingGroupStore.trigger(null, group);
  });

  it('_onViewingGroupChange should reload posts', function() {
    sandbox.mock(GroupActions).expects('loadPosts').once();

    this.page._onViewingGroupChange(null, group);
  });

  it('_onViewingGroupChange should reload playlists', function() {
    sandbox.mock(GroupActions).expects('loadPlaylists').once();
    sandbox.stub(GroupActions, 'loadPosts');

    this.page._onViewingGroupChange(null, group);
  });

  it('should add a member when a user is selected', function() {
    sandbox.mock(GroupActions).expects('addMember').withArgs(group.id, user);

    this.page.selectUser(user);
  });

  it('should remove a member when user is deselected', function() {
    sandbox.mock(GroupActions).expects('removeMember').withArgs(group.id, user);

    this.page.deselectUser(user);
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
