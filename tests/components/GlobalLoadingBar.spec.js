'use strict';

import React              from 'react';
import TestUtils          from 'react-addons-test-utils';

import GlobalLoadingStore from '../../app/js/stores/GlobalLoadingStore';
import GlobalLoadingBar   from '../../app/js/components/GlobalLoadingBar';

describe('Component: GlobalLoadingBar', function() {

  let rendered;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <GlobalLoadingBar />
    );
  }

  describe('#componentDidMount', function() {
    beforeEach(function() {
      renderComponent();
    });

    it('should listen to GlobalLoadingStore', function() {
      sandbox.stub(rendered, 'listenTo');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledOnce(rendered.listenTo, GlobalLoadingStore, rendered.updateProgress);
    });
  });

  describe('updating progress', function() {
    beforeEach(function() {
      renderComponent();
    });

    context('when new progress < 0', function() {
      beforeEach(function() {
        rendered.updateProgress(-5);
      });

      it('should translate the fill bar to -100%', function() {
        assert.strictEqual(rendered.refs.fill.style.transform, 'translateX(-100%)');
      });
    });

    context('when new progress > 100', function() {
      beforeEach(function() {
        rendered.updateProgress(105);
      });

      it('should translate the fill bar to 0%', function() {
        assert.strictEqual(rendered.refs.fill.style.transform, 'translateX(0%)');
      });
    });

    context('when new 0 < new progress <= 100', function() {
      beforeEach(function() {
        rendered.updateProgress(50);
      });

      it('should translate the fill bar to -100 + new progress', function() {
        assert.strictEqual(rendered.refs.fill.style.transform, 'translateX(-50%)');
      });
    });
  });

});
