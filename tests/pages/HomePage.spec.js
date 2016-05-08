'use strict';

import React         from 'react';
import TestUtils     from 'react-addons-test-utils';

import GlobalActions from '../../app/js/actions/GlobalActions';
import HomePage      from '../../app/js/pages/HomePage';
import HomePageStore from '../../app/js/stores/HomePageStore';

describe('Page: Home', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <HomePage {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  describe('#componentDidMount', function() {
    it('should listen to HomePageStore and call load action', function() {
      sandbox.stub(rendered, 'listenTo');
      sandbox.stub(GlobalActions, 'loadHomePage');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, HomePageStore, rendered._onPlaylistsChange);
      sinon.assert.calledOnce(GlobalActions.loadHomePage);
    });
  });

});
