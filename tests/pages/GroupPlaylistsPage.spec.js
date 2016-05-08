'use strict';

import React              from 'react';
import TestUtils          from 'react-addons-test-utils';

import testHelpers        from '../../utils/testHelpers';
import copyObject         from '../../utils/copyObject';
import GroupPlaylistsPage from '../../app/js/pages/GroupPlaylistsPage';
import CreatePlaylistPage from '../../app/js/pages/CreatePlaylistPage';

describe('Page: GroupPlaylists', function() {

  const GROUP = testHelpers.fixtures.group;
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <GroupPlaylistsPage {...props} />
    );
  }

  beforeEach(function() {
    props = {
      params: {
        slug: GROUP.slug
      },
      group: copyObject(GROUP)
    };
  });

  describe('#navigateToCreatePage', function() {
    beforeEach(function() {
      renderComponent();
    });

    it('should set the static property on CreatePlaylistPage and navigate', function() {
      const history = {
        pushState: sandbox.stub()
      };

      rendered.history = history;
      rendered.navigateToCreatePage(testHelpers.createNativeClickEvent());

      assert.deepEqual(CreatePlaylistPage.group, props.group);
      sinon.assert.calledWith(history.pushState, null, '/playlists/create');
    });
  });

  context('when user is member of group', function() {
    beforeEach(function() {
      props.isUserMember = sandbox.stub().returns(true);

      renderComponent();
    });

    it('should render CreateNewCard with correct props', function() {
      const createNewCard = rendered.refs.createNewCard;

      assert.isDefined(createNewCard);

      assert.strictEqual(createNewCard.props.type, 'playlist');
      assert.strictEqual(createNewCard.props.onClick, rendered.navigateToCreatePage);
    });
  });

  context('when user is not member of group', function() {
    beforeEach(function() {
      props.isUserMember = sandbox.stub().returns(false);

      renderComponent();
    });

    it('should not render CreateNewCard', function() {
      assert.isUndefined(rendered.refs.createNewCard);
    });
  });

});
