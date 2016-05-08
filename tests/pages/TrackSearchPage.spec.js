'use strict';

import React            from 'react';
import TestUtils        from 'react-addons-test-utils';

import TrackSearchPage  from '../../app/js/pages/TrackSearchPage';
import SearchActions    from '../../app/js/actions/SearchActions';
import TrackSearchStore from '../../app/js/stores/TrackSearchStore';

describe('Page: TrackSearch', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <TrackSearchPage {...props} />
    );
  }

  beforeEach(function() {
    props = {
      location: {
        query: {
          q: 'test',
          sources: 'soundcloud,youtube'
        }
      },
      setSearchState: sandbox.stub()
    };

    renderComponent();
  });

  describe('#componentDidMount', function() {
    it('should listen to TrackSearchStore', function() {
      sandbox.stub(rendered, 'listenTo');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, TrackSearchStore, rendered._onResultsChange);
    });
  });

  it('#componentDidUpdate should do search if query changes', function() {
    const prevProps = {
      location: {
        query: {
          q: 'old'
        }
      }
    };

    sandbox.stub(SearchActions, 'searchTracks');

    rendered.componentDidUpdate(prevProps);

    sinon.assert.calledOnce(SearchActions.searchTracks);
    sinon.assert.calledWith(SearchActions.searchTracks, props.location.query.q, props.location.query.sources.split(','));
  });

  it('#componentDidUpdate should do search if sources change', function() {
    const prevProps = {
      location: {
        query: {
          sources: 'soundcloud'
        }
      }
    };

    sandbox.stub(SearchActions, 'searchTracks');

    rendered.componentDidUpdate(prevProps);

    sinon.assert.calledOnce(SearchActions.searchTracks);
    sinon.assert.calledWith(SearchActions.searchTracks, props.location.query.q, props.location.query.sources.split(','));
  });

});
