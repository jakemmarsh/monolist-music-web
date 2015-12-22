'use strict';

import ReactDOM        from 'react-dom';
import {ListenerMixin} from 'reflux';

import TestHelpers     from '../../utils/testHelpers';
import GroupsPage      from '../../app/js/pages/GroupsPage';
import GlobalActions   from '../../app/js/actions/GlobalActions';
// import GroupActions    from '../../app/js/actions/GroupActions';

describe('Page: Groups', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to GroupsStore and load groups on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(GlobalActions).expects('loadGroups').once();

    TestHelpers.testPage('/groups', {}, {}, {}, GroupsPage, this.container, (component) => {
      this.page = component;
      ListenerMixin.listenTo.restore();
      GlobalActions.loadGroups.restore();
      done();
    });
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});