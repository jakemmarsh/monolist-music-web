'use strict';

import ReactDOM           from 'react-dom';
import {ListenerMixin}    from 'reflux';

import TestHelpers        from '../../utils/testHelpers';
import CurrentUserStore   from '../../app/js/stores/CurrentUserStore';
import LoginPage          from '../../app/js/pages/LoginPage';
import LoggedInRouteMixin from '../../app/js/mixins/LoggedInRouteMixin';

describe('Mixin: LoggedInRoute', function() {

  beforeEach(function() {
    window.history.replaceState(null, null, '/');
    this.container = document.createElement('div');
  });

  it('#componentDidMount should call _doLoginRedirect if the user has been checked and not found', function(done) {
    CurrentUserStore.hasChecked = true;
    CurrentUserStore.user = {};

    sandbox.mock(LoggedInRouteMixin).expects('_doLoginRedirect').once();

    TestHelpers.renderComponentForMixin(LoggedInRouteMixin, this.container, function() {
      done();
    });
  });

  it('#componentDidMount should start listening to CurrentUserStore if no user has been checked and/or found', function(done) {
    CurrentUserStore.hasChecked = false;

    sandbox.mock(ListenerMixin).expects('listenTo').once();

    TestHelpers.renderComponentForMixin(LoggedInRouteMixin, this.container, function() {
      done();
    });
  });

  it('#_doLoginRedirect should define the attempted transition on LoginPage and do the redirect', function(done) {
    TestHelpers.renderComponentForMixin(LoggedInRouteMixin, this.container, function(component) {
      sandbox.mock(component.history).expects('replaceState').withArgs(null, '/login');
      component._doLoginRedirect();

      LoginPage.attemptedTransition.should.eql({
        path: '/',
        query: {}
      });

      done();
    });
  });

  it('#_onCurrentUserStoreChange should call _doLoginRedirect if no user is logged in', function(done) {
    sandbox.mock(LoggedInRouteMixin).expects('_doLoginRedirect').once();

    TestHelpers.renderComponentForMixin(LoggedInRouteMixin, this.container, function(component) {
      component._onCurrentUserStoreChange(null, null);
      done();
    });
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
