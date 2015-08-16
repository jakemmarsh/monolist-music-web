'use strict';

import Router         from 'react-router';
import React          from 'react/addons';
import TestLocation   from 'react-router/lib/locations/TestLocation';
const  TestUtils      = React.addons.TestUtils;

var testHelpers = {

  testUser: {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    imageUrl: null,
    groups: [],
    followers: [],
    usersFollowing: [],
    playlistsFollowing: []
  },

  testPage(initialPath, targetComponent, container, cb) {
    TestLocation.history = [initialPath];
    let router = Router.create({
      routes: require('../app/js/Routes.js'),
      location: new TestLocation([initialPath])
    });

    router.run(function(Handler, state) {
      let routerMainComponent = React.render(
        <Handler params={state.params} query={state.query} />,
        container
      );

      cb(TestUtils.findRenderedComponentWithType(routerMainComponent, targetComponent));
    });
  },

  stubRouterContext(Component, props, stubs) {
    return React.createClass({
      childContextTypes: {
        makePath: React.PropTypes.func,
        makeHref: React.PropTypes.func,
        transitionTo: React.PropTypes.func,
        replaceWith: React.PropTypes.func,
        goBack: React.PropTypes.func,
        getCurrentPath: React.PropTypes.func,
        getCurrentRoutes: React.PropTypes.func,
        getCurrentPathname: React.PropTypes.func,
        getCurrentParams: React.PropTypes.func,
        getCurrentQuery: React.PropTypes.func,
        isActive: React.PropTypes.func
      },

      getChildContext: function() {
        return Object.assign({
          makePath: function() {},
          makeHref: function() {},
          transitionTo: function() {},
          replaceWith: function() {},
          goBack: function() {},
          getCurrentPath: function() {},
          getCurrentRoutes: function() {},
          getCurrentPathname: function() {},
          getCurrentParams: function() {},
          getCurrentQuery: function() {},
          isActive: function() {}
        }, stubs);
      },

      render: function() {
        return <Component {...props}/>;
      }
    });
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
    return TestUtils.findAllInRenderedTree(root, (inst) => {
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

export default testHelpers;