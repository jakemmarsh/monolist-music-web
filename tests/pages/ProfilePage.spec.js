'use strict';

import ReactDOM            from 'react-dom';
import {ListenerMixin}     from 'reflux';

import TestHelpers         from '../../utils/testHelpers';
import ProfilePage         from '../../app/js/pages/ProfilePage';
import UserActions         from '../../app/js/actions/UserActions';
import ViewingProfileStore from '../../app/js/stores/ViewingProfileStore';

describe('Page: Profile', function() {

  const user = TestHelpers.fixtures.user;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPlaylistStore and load playlist on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(UserActions).expects('openProfile').withArgs(user.username);

    TestHelpers.testPage('/profile/' + user.username, { username: user.username }, {}, {}, ProfilePage, this.container, (component) => {
      this.page = component;
      this.page.setState({ user: user });
      ListenerMixin.listenTo.restore();
      UserActions.openProfile.restore();
      done();
    });
  });

  it('should load a new profile on username change', function(done) {
    const nextProps = {
      currentUser: user,
      params: {
        username: 'testagain'
      }
    };

    sandbox.mock(UserActions).expects('openProfile').once().withArgs(nextProps.params.username);
    this.page.componentWillReceiveProps(nextProps);

    done();
  });

  it('should load a new profile on currentUser change', function(done) {
    const nextProps = {
      currentUser: user,
      params: {
        username: 'test'
      }
    };

    // Ensure that username is the same to only test currentUser logic
    this.page.props.params.username = 'test';
    sandbox.mock(UserActions).expects('openProfile').once().withArgs('test');
    this.page.componentWillReceiveProps(nextProps);

    done();
  });

  it('should call _onViewingProfileChange on store trigger', function(done) {

    sandbox.mock(this.page).expects('_onViewingProfileChange').once().withArgs(null, user);
    ViewingProfileStore.trigger(null, user);

    done();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
