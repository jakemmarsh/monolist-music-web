'use strict';

import React               from 'react';
import TestUtils           from 'react-addons-test-utils';

import PlaylistSearchPage  from '../../app/js/pages/PlaylistSearchPage';
import SearchActions       from '../../app/js/actions/SearchActions';
import PlaylistSearchStore from '../../app/js/stores/PlaylistSearchStore';

describe('Page: PlaylistSearch', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <PlaylistSearchPage {...props} />
    );
  }

  beforeEach(function() {
    props = {
      location: {
        query: {
          q: 'test'
        }
      }
    };

    renderComponent();
  });

  describe('#componentDidMount', function() {
    beforeEach(function() {
      sandbox.stub(SearchActions, 'searchPlaylists');
    });

    context('when props.location.query.q exists', function() {
      beforeEach(function() {
        renderComponent();
        SearchActions.searchPlaylists.reset();
        sandbox.stub(rendered, 'listenTo');
      });

      it('should do search', function() {
        rendered.componentDidMount();

        return Promise.resolve().then(() => {
          sinon.assert.calledOnce(SearchActions.searchPlaylists);
          sinon.assert.calledWith(SearchActions.searchPlaylists, props.location.query.q);
        });
      });
    });

    context('when props.location.query.q does not exist', function() {
      beforeEach(function() {
        delete props.location.query.q;

        renderComponent();
        sandbox.stub(rendered, 'listenTo');
      });

      it('should not do search', function() {
        rendered.componentDidMount();

        return Promise.resolve().then(() => {
          sinon.assert.notCalled(SearchActions.searchPlaylists);
        });
      });
    });

    it('should listen to PlaylistSearchStore', function() {
      sandbox.stub(rendered, 'listenTo');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, PlaylistSearchStore, rendered._onResultsChange);
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

    sandbox.stub(SearchActions, 'searchPlaylists');

    rendered.componentDidUpdate(prevProps);

    return Promise.resolve().then(() => {
      sinon.assert.calledOnce(SearchActions.searchPlaylists);
      sinon.assert.calledWith(SearchActions.searchPlaylists, props.location.query.q);
    });
  });

});
