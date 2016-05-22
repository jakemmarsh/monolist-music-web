'use strict';

import React                 from 'react';
import ReactDOM              from 'react-dom';
import TestUtils             from 'react-addons-test-utils';

import LayeredComponentMixin from '../../app/js/mixins/LayeredComponentMixin';

describe('Mixin: LayeredComponent', function() {

  let rendered;

  function renderMixin() {
    const ParentComponent = React.createClass({
      mixins: [LayeredComponentMixin],
      renderLayer() { return <div />; },
      render() { return null; }
    });

    rendered = TestUtils.renderIntoDocument(
      <ParentComponent />
    );
  }

  describe('#componentDidMount', function() {
    it('should set this._target', function() {
      renderMixin();

      assert.isDefined(rendered._target);
    });

    it('should append an element to the DOM', function() {
      sandbox.stub(document.body, 'appendChild');

      renderMixin();

      sinon.assert.calledOnce(document.body.appendChild);
    });

    it('should call this._renderLayer', function() {
      sandbox.stub(LayeredComponentMixin, '_renderLayer');

      renderMixin();

      sinon.assert.calledOnce(LayeredComponentMixin._renderLayer);
    });
  });

  describe('#componentDidUpdate', function() {
    beforeEach(function() {
      sandbox.stub(LayeredComponentMixin, '_renderLayer');
      renderMixin();
      LayeredComponentMixin._renderLayer.reset();
    });

    it('should call this._renderLayer', function() {
      rendered.componentDidUpdate();

      sinon.assert.calledOnce(LayeredComponentMixin._renderLayer);
    });
  });

  describe('#componentWillUnmount', function() {
    beforeEach(function() {
      sandbox.stub(document.body,'removeChild');
      sandbox.stub(LayeredComponentMixin, '_unrenderLayer');
      renderMixin();
    });

    it('should call this._unrenderLayer', function() {
      rendered.componentWillUnmount();

      sinon.assert.calledOnce(LayeredComponentMixin._unrenderLayer);
    });

    it('should call remove this._target from the DOM', function() {
      rendered.componentWillUnmount();

      sinon.assert.calledOnce(document.body.removeChild);
    });
  });

  describe('#_renderLayer', function() {
    beforeEach(function() {
      renderMixin();
    });

    it('should call ReactDOM.render', function() {
      sandbox.stub(ReactDOM, 'render');

      rendered._renderLayer();

      sinon.assert.calledOnce(ReactDOM.render);
    });

    it('should call this._bindEscapeListener', function() {
      sandbox.stub(rendered, '_bindEscapeListener');

      rendered._renderLayer();

      sinon.assert.calledOnce(rendered._bindEscapeListener);
    });
  });

  describe('#_unrenderLayer', function() {
    beforeEach(function() {
      renderMixin();
    });

    it('should call ReactDOM.unmountComponentAtNode', function() {
      sandbox.stub(ReactDOM, 'unmountComponentAtNode');

      rendered._unrenderLayer();

      sinon.assert.calledOnce(ReactDOM.unmountComponentAtNode);
    });

    it('should call this._unbindEscapeListener', function() {
      sandbox.stub(rendered, '_unbindEscapeListener');

      rendered._unrenderLayer();

      sinon.assert.calledOnce(rendered._unbindEscapeListener);
    });
  });

  describe('#_bindEscapeListener', function() {
    beforeEach(function() {
      renderMixin();
    });

    it('should add a global event listener for the escape key to trigger _unrenderLayer', function() {
      const evt = new KeyboardEvent('keydown', {
        keyCode: 27,
        which: 27
      });
      sandbox.stub(rendered, '_unrenderLayer');

      rendered._bindEscapeListener();

      document.dispatchEvent(evt);
      sinon.assert.calledOnce(rendered._unrenderLayer);
    });
  });

  describe('#_unbindEscapeListener', function() {
    beforeEach(function() {
      renderMixin();
    });

    it('should remove the global listener for the escape key', function() {
      const evt = new KeyboardEvent('keydown', {
        keyCode: 27,
        which: 27
      });
      sandbox.stub(rendered, '_unrenderLayer');

      rendered._unbindEscapeListener();

      document.dispatchEvent(evt);
      sinon.assert.notCalled(rendered._unrenderLayer);
    });
  });

});
