'use strict';

import React                from 'react/addons';
import {ListenerMixin}      from 'reflux';

import TestHelpers          from '../../utils/testHelpers';
import GroupFeedPage        from '../../app/js/pages/GroupFeedPage';
import GroupActions         from '../../app/js/actions/GroupActions';
import ViewingPostListStore from '../../app/js/stores/ViewingPostListStore';

describe('Page: GroupFeed', function() {

  let group = TestHelpers.fixtures.group;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPostListStore on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();

    TestHelpers.testPage('/group/' + group.slug, GroupFeedPage, this.container, (component) => {
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

  it('should call _onPostsChange when store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onPostsChange');
    ViewingPostListStore.trigger(null, []);

    done();
  });

  it('should load posts on mount if group exists', function(done) {
    sandbox.mock(GroupActions).expects('loadPosts').once();

    this.page.props.group = group;
    this.page.componentDidMount();

    done();
  });

  it('should load posts on update if group exists and is new', function(done) {
    let prevProps = {
      group: {}
    };

    sandbox.mock(GroupActions).expects('loadPosts').once();

    this.page.props.group = group;
    this.page.componentDidUpdate(prevProps);

    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});