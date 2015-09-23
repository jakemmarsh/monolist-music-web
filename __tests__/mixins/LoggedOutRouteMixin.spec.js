'use strict';

import React               from 'react';
import {ListenerMixin}     from 'reflux';

import TestHelpers         from '../../utils/TestHelpers';
import CurrentUserStore    from '../../app/js/stores/CurrentUserStore';
import LoggedOutRouteMixin from '../../app/js/mixins/LoggedOutRouteMixin';

describe('Mixin: LoggedOutRoute', function() {

  let user = TestHelpers.fixtures.user;

  beforeEach(function() {
    window.history.replaceState(null, null, '/');
    this.container = document.createElement('div');
  });

  it('#componentDidMount should call _doRedirect if the user has been checked and found', function(done) {
    CurrentUserStore.hasChecked = true;
    CurrentUserStore.user = user;

    sandbox.mock(LoggedOutRouteMixin).expects('_doRedirect').once();

    TestHelpers.renderComponentForMixin(LoggedOutRouteMixin, this.container, function() {
      done();
    });
  });

  it('#componentDidMount should start listening to CurrentUserStore if no user has been checked and/or found', function(done) {
    CurrentUserStore.hasChecked = false;

    sandbox.mock(ListenerMixin).expects('listenTo').once();

    TestHelpers.renderComponentForMixin(LoggedOutRouteMixin, this.container, function() {
      done();
    });
  });

  it('#_doRedirect should do the redirect', function(done) {
    TestHelpers.renderComponentForMixin(LoggedOutRouteMixin, this.container, function(component) {
      sandbox.mock(component.history).expects('replaceState').withArgs(null, '/');

      component._doRedirect();

      done();
    });
  });

  it('#_onCurrentUserStoreChange should call _doRedirect if user is logged in', function(done) {
    TestHelpers.renderComponentForMixin(LoggedOutRouteMixin, this.container, function(component) {
      sandbox.mock(component).expects('_doRedirect').once();

      component._onCurrentUserStoreChange(null, null);

      done();
    });
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});