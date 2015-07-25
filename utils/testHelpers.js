'use strict';

import _              from 'lodash';
import Router         from 'react-router';
import React          from 'react/addons';
import TestLocation   from 'react-router/modules/locations/TestLocation';
const  TestUtils      = React.addons.TestUtils;

export default {

  testUser: {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    type: 'instructor',
    imageUrl: null
  },

  testPage(initialPath, targetComponent, steps) {
    let router = Router.create({
      routes: require('../js/Routes.jsx'),
      location: new TestLocation([initialPath])
    });
    let routerMainComponent;
    let step;

    if ( !_.isArray(steps) ) {
      steps = [steps];
    }

    router.run(function (Handler, state) {
      step = steps.shift();

      routerMainComponent = TestUtils.renderIntoDocument(
        <Handler params={state.params} query={state.query} />
      );

      step(TestUtils.findRenderedComponentWithType(routerMainComponent, targetComponent));
    }.bind(this));
  },

  createNativeClickEvent() {
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', false, true);

    return evt;
  },

  createNativeMouseEvent(options) {
    let evt = document.createEvent('MouseEvents');
    evt.initEvent(options.action, false, true);

    return evt;
  },

  createNativeKeyboardEvent(options) {
    let evt = document.createEvent('HTMLEvents');
    let keyEvent = options.event || 'keyup';
    evt.which = options.which;
    evt.keycode = options.which;
    evt.initEvent(keyEvent, false, true);

    return evt;
  },

  noop() {},

  keyCodes: {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,
    COMMA: 188,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18
  },

  simulateRouterLinkClick(linkComponent) {
    TestUtils.Simulate.click(linkComponent, {button: 0});
  },

  scryRenderedDOMComponentsWithProp(root, propName, propValue) {
    return TestUtils.findAllInRenderedTree(root, function(inst) {
      let instancePropValue = inst.props[propName];

      return (
        TestUtils.isDOMComponent(inst)
        && instancePropValue
        && (' ' + instancePropValue + ' ').indexOf(' ' + propValue + ' ') !== -1
      );
    });
  },

  findRenderedDOMComponentWithProp(root, propName, propValue) {
    let all = this.scryRenderedDOMComponentsWithProp(root, propName, propValue);

    if (all.length !== 1) {
      throw new Error('Did not find exactly one match (found: ' + all.length + ') for prop  ' + propName + ' : ' + propValue);
    }

    return all[0];
  }

};