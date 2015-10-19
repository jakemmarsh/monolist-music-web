'use strict';

import React                 from 'react';
import ReactDOM              from 'react-dom';
import TestUtils             from 'react-addons-test-utils';
import $                     from 'jquery';

import TestHelpers           from '../../utils/testHelpers';
import LayeredComponentMixin from '../../app/js/mixins/LayeredComponentMixin';

describe('Mixin: LayeredComponent', function() {

  beforeEach(function() {
    this.container = document.createElement('div');
    LayeredComponentMixin.renderLayer = function() {
      return (<div />);
    };
  });

  it('#componentDidMount should set this._target', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      Should(component._target).not.be.undefined();
      done();
    });
  });

  it('#componentDidMount should append an element to the DOM', function(done) {
    sandbox.stub(LayeredComponentMixin, 'componentWillUnmount');
    sandbox.mock(document.body).expects('appendChild').once();

    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function() {
      done();
    });
  });

  it('#componentDidMount should call this._renderLayer', function(done) {
    sandbox.mock(LayeredComponentMixin).expects('_renderLayer').once();

    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function() {
      done();
    });
  });

  it('#componentDidUpdate should call this._renderLayer', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      sandbox.mock(LayeredComponentMixin).expects('_renderLayer').once();
      component.componentDidUpdate();
      done();
    });
  });

  it('#componentWillUnmount should call this._unrenderLayer', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      sandbox.stub(document.body,'removeChild');
      sandbox.mock(LayeredComponentMixin).expects('_unrenderLayer').once();

      component.componentWillUnmount();

      done();
    });
  });

  it('#componentWillUnmount should call remove this._target from the DOM', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      const stub = sandbox.stub(document.body, 'removeChild');

      component.componentWillUnmount();
      sinon.assert.calledOnce(stub);

      done();
    });
  });

  it('#_renderLayer should call ReactDOM.render', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      const stub = sandbox.stub(ReactDOM, 'render');

      component._renderLayer();
      sinon.assert.calledOnce(stub);

      done();
    });
  });

  it('#_renderLayer should call this._bindEscapeListener', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      const stub = sandbox.stub(component, '_bindEscapeListener');

      component._renderLayer();
      sinon.assert.calledOnce(stub);

      done();
    });
  });

  it('#_unrenderLayer should call ReactDOM.unmountComponentAtNode', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      const stub = sandbox.stub(ReactDOM, 'unmountComponentAtNode');

      component._unrenderLayer();
      sinon.assert.calledOnce(stub);

      done();
    });
  });

  it('#_unrenderLayer should call this._unbindEscapeListener', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      const stub = sandbox.stub(component, '_unbindEscapeListener');

      component._unrenderLayer();
      sinon.assert.calledOnce(stub);

      done();
    });
  });

  it('#_bindEscapeListener should add a global event listener for the escape key to trigger _unrenderLayer', function(done) {
    sandbox.stub(LayeredComponentMixin, 'componentDidMount');

    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      const stub = sandbox.stub(component, '_unrenderLayer');
      const evt = $.Event('keydown');

      evt.which = 27;
      component._bindEscapeListener();

      $(document).trigger(evt);
      sinon.assert.calledOnce(stub);

      done();
    });
  });

  it('#_unbindEscapeListener should remove the global listener for the escape key', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      const stub = sandbox.stub(component, '_unrenderLayer');
      const evt = $.Event('keydown');

      evt.which = 27;

      component._unbindEscapeListener();

      $(document).trigger(evt);
      sinon.assert.callCount(stub, 0);

      done();
    });
  });

  afterEach(function() {
    sandbox.restore();
    sandbox.stub(LayeredComponentMixin, 'componentWillUnmount');

    if ( this.container ) {
      try {
        ReactDOM.unmountComponentAtNode(this.container);
      } catch(e) {
        console.log('Couldn\'t unmount.');
      }
    }
  });

});