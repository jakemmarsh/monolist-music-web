'use strict';

import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import {ListenerMixin}  from 'reflux';

import testHelpers      from '../../utils/testHelpers';
import copyObject       from '../../utils/copyObject';
import GroupSearchPage  from '../../app/js/pages/GroupSearchPage';
import GroupSearchStore from '../../app/js/stores/GroupSearchStore';
import SearchActions    from '../../app/js/actions/SearchActions';

describe('Page: GroupSearch', function() {

  const GROUP = testHelpers.fixtures.group;
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <GroupSearchPage {...props} />
    );
  }

  beforeEach(function() {
    props = {
      location: {
          query: {
          q: 'test'
        }
      },
      group: copyObject(GROUP),
      setSearchState: sandbox.stub()
    };
  });

  describe('#componentDidMount', function() {
    beforeEach(function() {
      sandbox.stub(SearchActions, 'searchGroups');
    });

    context('when props.location.query.q exists', function() {
      beforeEach(function() {
        renderComponent();
        SearchActions.searchGroups.reset();
        sandbox.stub(rendered, 'listenTo');
      });

      it('should listen to GroupSearchStore', function() {
        rendered.componentDidMount();

        sinon.assert.calledOnce(rendered.listenTo);
        sinon.assert.calledWith(rendered.listenTo, GroupSearchStore, rendered._onResultsChange);
      });

      it('should do search', function() {
        rendered.componentDidMount();

        return Promise.resolve().then(() => {
          sinon.assert.calledOnce(SearchActions.searchGroups);
          sinon.assert.calledWith(SearchActions.searchGroups, props.location.query.q);
        });
      });
    });

    context('when props.location.query.q does not exist', function() {
      beforeEach(function() {
        delete props.location.query.q;

        renderComponent();
        sandbox.stub(rendered, 'listenTo');
      });

      it('should listen to GroupSearchStore', function() {
        rendered.componentDidMount();

        sinon.assert.calledOnce(rendered.listenTo);
        sinon.assert.calledWith(rendered.listenTo, GroupSearchStore, rendered._onResultsChange);
      });

      it('should not do search', function() {
        rendered.componentDidMount();

        return Promise.resolve().then(() => {
          sinon.assert.notCalled(SearchActions.searchGroups);
        });
      });
    });
  });

  it('#componentDidUpdate should clear results and do search if query changes', function() {
    renderComponent();

    const prevProps = {
      location: {
        query: {
          q: 'old'
        }
      }
    };

    sandbox.stub(SearchActions, 'searchGroups');

    rendered.componentDidUpdate(prevProps);

    return Promise.resolve().then(() => {
      assert.deepEqual(rendered.state.results, []);
      sinon.assert.calledOnce(SearchActions.searchGroups);
      sinon.assert.calledWith(SearchActions.searchGroups, props.location.query.q);
    });
  });

});
