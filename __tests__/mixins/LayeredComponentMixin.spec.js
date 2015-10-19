'use strict';

import React                 from 'react';
import ReactDOM              from 'react-dom';

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
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function() {
      done();
    });
  });

  it('#componentDidUpdate should call this._renderLayer', function(done) {
    sandbox.mock(LayeredComponentMixin).expects('_renderLayer');

    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      component.componentDidUpdate();
      done();
    });
  });

  it('#componentWillUnmount should call this._unrenderLayer', function(done) {
    sandbox.stub(document.body,'removeChild');
    sandbox.mock(LayeredComponentMixin).expects('_unrenderLayer').once();

    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      component.componentWillUnmount();
      done();
    });
  });

  it('#componentWillUnmount should call remove this._target from the DOM', function(done) {
    const stub = sandbox.stub(document.body, 'removeChild');

    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function(component) {
      component.componentWillUnmount();
      sinon.assert.calledOnce(stub);
      done();
    });
  });

  it('#_renderLayer should call ReactDOM.render', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function() {
      done();
    });
  });

  it('#_unrenderLayer should call ReactDOM.render', function(done) {
    TestHelpers.renderComponentForMixin(LayeredComponentMixin, this.container, function() {
      done();
    });
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});