'use strict';

import ReactDOM        from 'react-dom';
import {ListenerMixin} from 'reflux';

import TestHelpers     from '../../utils/testHelpers';
import GroupSearchPage from '../../app/js/pages/GroupSearchPage';
import SearchActions   from '../../app/js/actions/SearchActions';

describe('Page: GroupSearch', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to PlaylistSearchStore on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();

    TestHelpers.testPage('/search/groups', {}, { q: 'test' }, {}, GroupSearchPage, this.container, (component) => {
      this.page = component;
      sandbox.restore();
      done();
    });
  });

  it('should exist', function() {
    Should.exist(ReactDOM.findDOMNode(this.page));
  });

  it('#componentDidUpdate should do search if query changes', function() {
    let prevProps = {
      query: {
        q: 'old'
      }
    };

    this.page.props.query.q = 'test';
    sandbox.mock(this.page).expects('doSearch');
    this.page.componentDidUpdate(prevProps);
  });

  it('#doSearch should call search action', function() {
    sandbox.mock(SearchActions).expects('searchGroups');
    this.page.doSearch();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});