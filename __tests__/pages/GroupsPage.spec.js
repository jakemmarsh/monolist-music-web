'use strict';

import React           from 'react/addons';
import {ListenerMixin} from 'reflux';

import TestHelpers     from '../../utils/testHelpers';
import GroupsPage      from '../../app/js/pages/GroupsPage';
import GlobalActions   from '../../app/js/actions/GlobalActions';
import GroupActions    from '../../app/js/actions/GroupActions';

const  TestUtils   = React.addons.TestUtils;

describe('Page: Groups', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to GroupsStore and load groups on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(GlobalActions).expects('loadGroups').once();

    TestHelpers.testPage('/groups', GroupsPage, this.container, (component) => {
      this.page = component;
      sandbox.restore();
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});