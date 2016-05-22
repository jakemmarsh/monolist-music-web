'use strict';

import React              from 'react';
import TestUtils          from 'react-addons-test-utils';
import {ListenerMixin}    from 'reflux';

import CurrentUserStore   from '../../app/js/stores/CurrentUserStore';
import LoginPage          from '../../app/js/pages/LoginPage';
import LoggedInRouteMixin from '../../app/js/mixins/LoggedInRouteMixin';

describe('Mixin: LoggedInRoute', function() {
  let rendered;

  function renderMixin() {
    const ParentComponent = React.createClass({
      mixins: [LoggedInRouteMixin],
      render() { return null; }
    });

    rendered = TestUtils.renderIntoDocument(
      <ParentComponent />
    );
  }

  it('#componentDidMount should call _doLoginRedirect if the user has been checked and not found', function() {
    CurrentUserStore.hasChecked = true;
    CurrentUserStore.user = {};

    sandbox.stub(LoggedInRouteMixin, '_doLoginRedirect');

    renderMixin();

    sinon.assert.calledOnce(LoggedInRouteMixin._doLoginRedirect);
  });

  it('#componentDidMount should start listening to CurrentUserStore if no user has been checked and/or found', function() {
    CurrentUserStore.hasChecked = false;

    sandbox.stub(ListenerMixin, 'listenTo');

    renderMixin();

    sinon.assert.calledOnce(ListenerMixin.listenTo);
    sinon.assert.calledWith(ListenerMixin.listenTo, CurrentUserStore, sinon.match.func);
  });

  it('#_doLoginRedirect should define the attempted transition on LoginPage and do the redirect', function() {
    renderMixin();

    rendered.history = {
      replaceState: sandbox.stub()
    };

    rendered._doLoginRedirect();

    assert.deepEqual(LoginPage.attemptedTransition, {
      path: '/',
      query: {}
    });

    sinon.assert.calledOnce(rendered.history.replaceState);
    sinon.assert.calledWith(rendered.history.replaceState, null, '/login');
  });

  it('#_onCurrentUserStoreChange should call _doLoginRedirect if no user is logged in', function() {
    sandbox.stub(LoggedInRouteMixin, '_doLoginRedirect');

    renderMixin();
    rendered._onCurrentUserStoreChange(null, null);

    sinon.assert.calledOnce(LoggedInRouteMixin._doLoginRedirect);
  });

});
