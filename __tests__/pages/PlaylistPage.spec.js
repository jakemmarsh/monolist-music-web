'use strict';

import ReactDOM             from 'react-dom';
import {ListenerMixin}      from 'reflux';

import TestHelpers          from '../../utils/testHelpers';
import PlaylistPage         from '../../app/js/pages/PlaylistPage';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';

describe('Page: Playlist', function() {

  const playlist = TestHelpers.fixtures.playlist;
  const track = TestHelpers.fixtures.track;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPlaylistStore and load playlist on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(PlaylistActions).expects('open').withArgs(playlist.slug);

    TestHelpers.testPage('/playlist/' + playlist.slug, { slug: playlist.slug }, {}, {}, PlaylistPage, this.container, (component) => {
      this.page = component;
      this.page.setState({ playlist: playlist });
      ListenerMixin.listenTo.restore();
      PlaylistActions.open.restore();
      done();
    });
  });

  it('should call _onViewingPlaylistChange when store is triggered', function() {
    sandbox.mock(this.page).expects('_onViewingPlaylistChange');
    ViewingPlaylistStore.trigger(null, playlist);
  });

  it('should call _onViewingPlaylistChange when a new playlist is opened', function() {
    const newSlug = 'new-slug';

    sandbox.mock(PlaylistActions).expects('open').withArgs(newSlug);
    this.page.componentWillReceiveProps({ params: { slug: newSlug } });
  });

  it('should remove a track from the playlist', function() {
    sandbox.mock(PlaylistActions).expects('removeTrack').once().withArgs(playlist, track);

    this.page.removeTrackFromPlaylist(track);
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
