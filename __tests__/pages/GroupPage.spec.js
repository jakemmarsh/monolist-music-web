'use strict';

import React             from 'react/addons';
import {ListenerMixin}   from 'reflux';

import TestHelpers       from '../../utils/testHelpers';
import GroupPage         from '../../app/js/pages/GroupPage';
import GroupActions      from '../../app/js/actions/GroupActions';
import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore';

describe('Page: Group', function() {

  let group = TestHelpers.fixtures.group;
  let user = TestHelpers.fixtures.user;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingGroupStore and load group on mount
    sandbox.mock(ListenerMixin).expects('listenTo').atLeast(1);
    sandbox.mock(GroupActions).expects('open').withArgs(group.slug);

    TestHelpers.testPage('/group/' + group.slug, GroupPage, this.container, (component) => {
      this.page = component;
      this.page.setState({ group: group });
      sandbox.restore();
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  it('should call _onViewingGroupChange when store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onViewingGroupChange');
    ViewingGroupStore.trigger(null, group);

    done();
  });

  it('_onViewingGroupChange should reload posts', function(done) {
    sandbox.mock(GroupActions).expects('loadPosts').once();

    this.page._onViewingGroupChange(null, group);

    done();
  });

  it('_onViewingGroupChange should reload playlists', function(done) {
    sandbox.mock(GroupActions).expects('loadPlaylists').once();

    this.page._onViewingGroupChange(null, group);

    done();
  });

  it('should add a member when a user is selected', function(done) {
    sandbox.mock(GroupActions).expects('addMember').withArgs(group.id, user);

    this.page.selectUser(user);

    done();
  });

  it('should remove a member when user is deselected', function(done) {
    sandbox.mock(GroupActions).expects('removeMember').withArgs(group.id, user);

    this.page.deselectUser(user);

    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});