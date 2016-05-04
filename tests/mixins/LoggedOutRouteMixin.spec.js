'use strict';

import React               from 'react';
import TestUtils           from 'react-addons-test-utils';
import {ListenerMixin}     from 'reflux';

import testHelpers         from '../../utils/testHelpers';
import copyObject          from '../../utils/copyObject';
import CurrentUserStore    from '../../app/js/stores/CurrentUserStore';
import LoggedOutRouteMixin from '../../app/js/mixins/LoggedOutRouteMixin';

describe('Mixin: LoggedOutRoute', function() {

  const USER = copyObject(testHelpers.fixtures.user);
  let rendered;

  function renderMixin() {
    const ParentComponent = React.createClass({
      mixins: [LoggedOutRouteMixin],
      render() { return null; }
    });

    rendered = TestUtils.renderIntoDocument(
      <ParentComponent />
    );
  }

  it('#componentDidMount should call _doRedirect if the user has been checked and found', function() {
    CurrentUserStore.hasChecked = true;
    CurrentUserStore.user = USER;

    sandbox.stub(LoggedOutRouteMixin, '_doRedirect');

    renderMixin();

    sinon.assert.calledOnce(LoggedOutRouteMixin._doRedirect);
  });

  it('#componentDidMount should start listening to CurrentUserStore if no user has been checked and/or found', function() {
    CurrentUserStore.hasChecked = false;

    sandbox.stub(ListenerMixin, 'listenTo');

    renderMixin();

    sinon.assert.calledOnce(ListenerMixin.listenTo);
    sinon.assert.calledWith(ListenerMixin.listenTo, CurrentUserStore, sinon.match.func);
  });

  it('#_doRedirect should do the redirect', function() {
    renderMixin();

    rendered.history = {
      replaceState: sandbox.stub()
    };

    rendered._doRedirect();

    sinon.assert.calledOnce(rendered.history.replaceState);
    sinon.assert.calledWith(rendered.history.replaceState, null, '/');
  });

  it('#_onCurrentUserStoreChange should call _doRedirect if user is logged in', function() {
    sandbox.stub(LoggedOutRouteMixin, '_doRedirect');

    renderMixin();

    rendered._onCurrentUserStoreChange(null, USER);

    sinon.assert.calledOnce(LoggedOutRouteMixin._doRedirect);
  });

});
