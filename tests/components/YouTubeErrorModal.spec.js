'use strict';

import React             from 'react';
import TestUtils         from 'react-addons-test-utils';

import testHelpers       from '../../utils/testHelpers';
import copyObject        from '../../utils/copyObject';
import GlobalActions     from '../../app/js/actions/GlobalActions';
import PlaylistActions   from '../../app/js/actions/PlaylistActions';
import PlaybackActions   from '../../app/js/actions/PlaybackActions';
import YouTubeErrorModal from '../../app/js/components/YouTubeErrorModal';

describe('Component: YouTubeErrorModal', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <YouTubeErrorModal {...props} />
    );
  }

  function itShouldRenderMessage() {
    it('should render props.message', function() {
      assert.isDefined(rendered.refs.message);
      assert.strictEqual(rendered.refs.message.textContent, props.message);
    });
  }

  function itShouldCloseOnDismissButtonClick() {
    it('should proceed to next track and close on dismiss button click', function() {
      sandbox.stub(PlaybackActions, 'nextTrack');
      sandbox.stub(GlobalActions, 'closeModal');

      TestUtils.Simulate.click(rendered.refs.dismissButton);

      sinon.assert.calledOnce(PlaybackActions.nextTrack);
      sinon.assert.calledOnce(GlobalActions.closeModal);
    });
  }

  beforeEach(function() {
    props = {
      message: 'Test message',
      currentTrack: copyObject(testHelpers.fixtures.track),
      currentPlaylist: copyObject(testHelpers.fixtures.playlist),
      currentUser: copyObject(testHelpers.fixtures.user)
    };
  });

  context('when user is playlist collaborator', function() {
    beforeEach(function() {
      props.currentPlaylist.owner = props.currentUser;
      renderComponent();
    });

    itShouldRenderMessage();
    itShouldCloseOnDismissButtonClick();

    it('should render the "Delete from Playlist" button', function() {
      assert.isDefined(rendered.refs.deleteButton);
    });

    it('should call removeTrack action and close on "Delete from Playlist" click', function() {
      sandbox.stub(PlaylistActions, 'removeTrack').yields();
      sandbox.stub(PlaybackActions, 'nextTrack');
      sandbox.stub(GlobalActions, 'closeModal');

      TestUtils.Simulate.click(rendered.refs.deleteButton);

      sinon.assert.calledOnce(PlaylistActions.removeTrack);
      sinon.assert.calledWith(PlaylistActions.removeTrack, props.currentPlaylist, props.currentTrack, rendered.closeModal);
      sinon.assert.calledOnce(PlaybackActions.nextTrack);
      sinon.assert.calledOnce(GlobalActions.closeModal);
    });
  });

  context('when user is not a playlist collaborator', function() {
    beforeEach(function() {
      props.currentPlaylist.owner = { id: 5000 };
      props.currentPlaylist.collaborators = [];
      renderComponent();
    });

    itShouldRenderMessage();
    itShouldCloseOnDismissButtonClick();

    it('should not render the "Delete from Playlist" button', function() {
      assert.isUndefined(rendered.refs.deleteButton);
    });
  });

});
