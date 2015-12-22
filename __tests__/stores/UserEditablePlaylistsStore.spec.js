'use strict';

import when                       from 'when';

import TestHelpers                from '../../utils/testHelpers';
import UserEditablePlaylistsStore from '../../app/js/stores/UserEditablePlaylistsStore';
import CurrentUserStore           from '../../app/js/stores/CurrentUserStore';
import CurrentPlaylistStore       from '../../app/js/stores/CurrentPlaylistStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import PlaylistActions            from '../../app/js/actions/PlaylistActions';
import UserAPI                    from '../../app/js/utils/UserAPI';
import PlaylistAPI                from '../../app/js/utils/PlaylistAPI';

describe('Store: UserEditablePlaylists', function() {

  before(function() {
    CurrentUserStore.user = TestHelpers.fixtures.user;
  });

  it('should load user\'s editable playlists on action', function(done) {
    sandbox.mock(UserAPI).expects('getEditablePlaylists').returns(when());

    GlobalActions.loadUserEditablePlaylists();

    done();
  });

  it('should create a new playlist on action', function(done) {
    let playlist = {
      id: 1,
      title: 'test'
    };

    sandbox.mock(PlaylistAPI).expects('create').withArgs(playlist).returns(when());

    PlaylistActions.create(playlist);

    done();
  });

  it('should add a new track to playlist on action', function(done) {
    let playlist = { id: 1 };
    let track = { title: 'test' };

    sandbox.mock(PlaylistAPI).expects('addTrack').withArgs(playlist.id, track).returns(when(playlist));

    PlaylistActions.addTrack(playlist, track);

    done();
  });

  it('should call play after adding a new track if changing current playlist', function(done) {
    let playlist = { id: 1 };
    let track = { title: 'test' };
    CurrentPlaylistStore.playlist = playlist;

    sandbox.mock(PlaylistAPI).expects('addTrack').withArgs(playlist.id, track).returns(when(playlist));
    sandbox.mock(PlaylistActions).expects('play').once();
    PlaylistActions.addTrack(playlist, track);

    done();
  });

});