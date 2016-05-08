'use strict';

import React               from 'react';
import TestUtils           from 'react-addons-test-utils';

import testHelpers         from '../../utils/testHelpers';
import copyObject          from '../../utils/copyObject';
import ProfilePage         from '../../app/js/pages/ProfilePage';
import UserActions         from '../../app/js/actions/UserActions';
import ViewingProfileStore from '../../app/js/stores/ViewingProfileStore';

describe('Page: Profile', function() {

  const USER = testHelpers.fixtures.user;
  const SECOND_USER = testHelpers.fixtures.secondUser;
  let rendered;
  let props;

  function renderComponent(done) {
    rendered = TestUtils.renderIntoDocument(
      <ProfilePage {...props} />
    );

    rendered.setState({ profile: copyObject(USER) }, done);
  }

  beforeEach(function(done) {
    props = {
      params: {
        username: USER.username
      },
      currentUser: copyObject(SECOND_USER)
    };

    renderComponent(done);
  });

  describe('#componentDidMount', function() {
    it('should listen to ViewingProfileStore and call open profile action', function() {
      sandbox.stub(rendered, 'listenTo');
      sandbox.stub(UserActions, 'openProfile');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, ViewingProfileStore, rendered._onViewingProfileChange);
      sinon.assert.calledOnce(UserActions.openProfile);
      sinon.assert.calledWith(UserActions.openProfile, props.params.username);
    });
  });

  it('should load a new profile on username change', function() {
    const nextProps = {
      currentUser: copyObject(USER),
      params: {
        username: 'testagain'
      }
    };

    sandbox.stub(UserActions, 'openProfile');
    rendered.componentWillReceiveProps(nextProps);

    sinon.assert.calledOnce(UserActions.openProfile);
    sinon.assert.calledWith(UserActions.openProfile, nextProps.params.username);
  });

  it('should load a new profile on currentUser change', function() {
    const nextProps = {
      currentUser: copyObject(USER),
      params: {
        username: 'test'
      }
    };

    // Ensure that username is the same to only test currentUser logic
    rendered.props.params.username = nextProps.params.username;
    sandbox.stub(UserActions, 'openProfile');

    rendered.componentWillReceiveProps(nextProps);

    sinon.assert.calledOnce(UserActions.openProfile);
    sinon.assert.calledWith(UserActions.openProfile, nextProps.params.username);
  });

});
