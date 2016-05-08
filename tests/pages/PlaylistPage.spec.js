'use strict';

import React                from 'react';
import TestUtils            from 'react-addons-test-utils';

import testHelpers          from '../../utils/testHelpers';
import copyObject           from '../../utils/copyObject';
import PlaylistPage         from '../../app/js/pages/PlaylistPage';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';

describe('Page: Playlist', function() {

  const PLAYLIST = testHelpers.fixtures.playlist;
  const TRACK = testHelpers.fixtures.track;
  let rendered;
  let props;

  function renderComponent(done) {
    rendered = TestUtils.renderIntoDocument(
      <PlaylistPage {...props} />
    );

    rendered.setState({ playlist: copyObject(PLAYLIST) }, done);
  }

  beforeEach(function(done) {
    props = {
      params: {
        slug: PLAYLIST.slug
      }
    };

    renderComponent(done);
  });

  describe('#componentDidMount', function() {
    it('should listen to ViewingPlaylistStore and load playlist', function() {
      sandbox.stub(rendered, 'listenTo');
      sandbox.stub(PlaylistActions, 'open');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, ViewingPlaylistStore, rendered._onViewingPlaylistChange);
      sinon.assert.calledOnce(PlaylistActions.open);
      sinon.assert.calledWith(PlaylistActions.open, props.params.slug.toString());
    });
  });

  describe('#componentWillReceiveProps', function() {
    it('should call _onViewingPlaylistChange when a new playlist is opened', function() {
      const newSlug = 'new-slug';

      sandbox.stub(PlaylistActions, 'open');

      rendered.componentWillReceiveProps({ params: { slug: newSlug } });

      return Promise.resolve().then(() => {
        sinon.assert.calledOnce(PlaylistActions.open);
        sinon.assert.calledWith(PlaylistActions.open, newSlug);
      });
    });
  });

  describe('#removeTrackFromPlaylist', function() {
    it('should remove a track from the playlist', function() {
      sandbox.stub(PlaylistActions, 'removeTrack');

      rendered.removeTrackFromPlaylist(TRACK);

      sinon.assert.calledOnce(PlaylistActions.removeTrack);
      sinon.assert.calledWith(PlaylistActions.removeTrack, PLAYLIST, TRACK);
    });
  });

});
