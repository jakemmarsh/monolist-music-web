'use strict';

import React               from 'react';
import TestUtils           from 'react-addons-test-utils';

import GroupsPage          from '../../app/js/pages/GroupsPage';
import TrendingGroupsStore from '../../app/js/stores/TrendingGroupsStore';
import GlobalActions       from '../../app/js/actions/GlobalActions';

describe('Page: Groups', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <GroupsPage {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  describe('#componentDidMount', function() {
    it('should listen to TrendingGroupsStore and load groups', function() {
      sandbox.stub(rendered, 'listenTo');
      sandbox.stub(GlobalActions, 'loadGroups');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, TrendingGroupsStore, rendered._onGroupsChange);
      sinon.assert.calledOnce(GlobalActions.loadGroups);
    });
  });

});
