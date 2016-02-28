'use strict';

import {Router, Route}       from 'react-router';
import React                 from 'react';
import ReactDOM              from 'react-dom';
import TestUtils             from 'react-addons-test-utils';
import {createMemoryHistory} from 'history';
import _                     from 'lodash';

const testHelpers = {

  fixtures: {
    user: {
      id: 1,
      email: 'test@test.com',
      username: 'test',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      imageUrl: 'http://franthony.com/wp-content/uploads/2015/04/record-player.jpg',
      groups: [],
      followers: [],
      usersFollowing: [],
      playlistsFollowing: []
    },
    playlist: {
      tags: ['test', 'hip hop', 'rap'],
      id: 1,
      title: 'Test Playlist',
      ownerType: 'user',
      ownerId: 1,
      slug: 'test-playlist',
      imageUrl: 'http://franthony.com/wp-content/uploads/2015/04/record-player.jpg',
      privacy: 'public',
      createdAt: '2015-08-16T20:15:24.503Z',
      updatedAt: '2015-08-16T20:15:24.503Z',
      collaborations: [],
      comments: [{ id: 1 }],
      upvotes: [],
      downvotes: [],
      followers: [],
      likes: [],
      owner: {
        id: 1,
        username: 'test'
      },
      collaborators: [],
      tracks: [
        {
          id: 1,
          createdAt: '2015-08-16T20:15:24.535Z'
        },
        {
          id: 2,
          createdAt: '2015-08-17T20:15:24.535Z'
        }
      ]
    },
    group: {
      id: 1,
      title: 'Test Group',
      slug: 'test-group',
      description: 'This is a group for anyone since it is just for testing.',
      imageUrl: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/10375152_10153451820467673_5915045047010730686_n.jpg?oh=3eec477b3d0925b8f39802bbb68c3789&oe=565AA6AE',
      privacy: 'public',
      inviteLevel: 1,
      createdAt: '2015-08-16T20:15:24.531Z',
      updatedAt: '2015-08-16T20:15:24.536Z',
      ownerId: 1,
      owner: {
        id: 1,
        username: 'test'
      },
      members: []
    },
    track: {
      id: 1,
      title: 'Attak (feat. Danny Brown)',
      artist: null,
      duration: 181,
      source: 'soundcloud',
      sourceParam: '159945668',
      sourceUrl: 'http://soundcloud.com/rustie/attak-feat-danny-brown',
      imageUrl: 'https://i1.sndcdn.com/artworks-000086001473-mw7dye-large.jpg',
      createdAt: '2015-08-16T20:15:24.535Z',
      updatedAt: '2015-08-16T20:15:24.535Z',
      playlistId: 1,
      userId: 1,
      user: {},
      comments: [],
      upvotes: [],
      downvotes: []
    },
    post: {
      id: 1,
      body: 'test body',
      user: {
        id: 1
      },
      track: {},
      comments: []
    },
    comment: {
      id: 1,
      body: 'this is a comment',
      user: {
        id: 1,
        username: 'test'
      },
      createdAt: new Date()
    },
    notification: {
      id: 1,
      entityType: 'playlist',
      entityId: 1,
      entity: {
        title: 'test'
      },
      read: false,
      action: 'like',
      actor: {
        username: 'test',
        id: 2
      },
      recipient: {
        username: 'jakemmarsh',
        id: 1
      },
      createdAt: new Date()
    }
  },

  testPage(initialPath, params = {}, query = {}, props = {}, targetComponent, container, cb) {
    const fixtures = this.fixtures;

    const ParentComponent = React.createClass({
      propTypes: {
        params: React.PropTypes.object,
        location: React.PropTypes.object,
        children: React.PropTypes.object
      },

      renderChildren() {
        return this.props.children && React.cloneElement(this.props.children, _.merge(props, {
          params: _.merge(this.props.params, params),
          location: _.merge(this.props.location, { query: query }),
          currentUser: fixtures.user
        }));
      },

      render() {
        return this.renderChildren();
      }
    });

    ReactDOM.render((
      <Router history={createMemoryHistory(initialPath)}>
        <Route component={ParentComponent}>
          <Route path={initialPath} component={targetComponent} />
        </Route>
      </Router>
    ), container, function() {
      cb(TestUtils.findRenderedComponentWithType(this, targetComponent));
    });
  },

  renderStubbedComponent(Component, props) {
    const StubbedParent = React.createClass({
      childContextTypes: {
        router: React.PropTypes.object
      },

      propTypes: {
        children: React.PropTypes.func
      },

      getChildContext() {
        return {
          router: {
            makePath(pathname, query) { },
            makeHref(pathname, query) { },
            transitionTo(pathname, query, state=null) { },
            replaceWith(pathname, query, state=null) { },
            go(n) { },
            goBack() { },
            goForward() { },
            isActive(pathname, query) { }
          }
        };
      },

      render() {
        return this.props.children();
      }
    });

    return TestUtils.findRenderedComponentWithType(TestUtils.renderIntoDocument(
      <StubbedParent>
        {() => <Component {...props} />}
      </StubbedParent>
    ), Component);
  },

  renderComponentForMixin(Mixin, dependencies, container, cb = function() {}) {
    if ( !_.isArray(dependencies) ) {
      cb = container;
      container = dependencies;
      dependencies = [];
    }

    let Component = React.createClass({
      mixins: [Mixin, {...dependencies}],
      render () { return null; }
    });

    return this.testPage('/', {}, {}, {}, Component, container, cb);
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