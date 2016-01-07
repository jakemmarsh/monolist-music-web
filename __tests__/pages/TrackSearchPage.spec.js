'use strict';

import ReactDOM        from 'react-dom';
import {ListenerMixin} from 'reflux';

import TestHelpers     from '../../utils/testHelpers';
import TrackSearchPage from '../../app/js/pages/TrackSearchPage';
import SearchActions   from '../../app/js/actions/SearchActions';

describe('Page: TrackSearch', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to PlaylistSearchStore on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();

    TestHelpers.testPage('/search/tracks', {}, { q: 'test' }, { setSearchState: () => {} }, TrackSearchPage, this.container, (component) => {
      this.page = component;
      ListenerMixin.listenTo.restore();
      done();
    });
  });

  it('#componentDidUpdate should do search if query changes', function(done) {
    let prevProps = {
      location: {
        query: {
          q: 'old'
        }
      }
    };

    this.page.props.location.query.q = 'test';
    sandbox.mock(this.page).expects('doSearch');
    this.page.componentDidUpdate(prevProps);

    done();
  });

  it('#componentDidUpdate should do search if sources change', function(done) {
    let prevProps = {
      location: {
        query: {
          sources: 'soundcloud'
        }
      }
    };

    this.page.props.location.query.sources = 'soundcloud,youtube';
    sandbox.mock(this.page).expects('doSearch');
    this.page.componentDidUpdate(prevProps);

    done();
  });

  it('#doSearch should call search action', function(done) {
    let query = 'test';

    this.page.setState({ query: query });
    sandbox.mock(SearchActions).expects('searchTracks');
    this.page.doSearch();

    done();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});