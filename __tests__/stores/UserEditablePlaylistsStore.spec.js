'use strict';

import when                       from 'when';

import UserEditablePlaylistsStore from '../../app/js/stores/UserEditablePlaylistsStore';
import CurrentUserStore           from '../../app/js/stores/CurrentUserStore';
import CurrentPlaylistStore       from '../../app/js/stores/CurrentPlaylistStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import PlaylistActions            from '../../app/js/actions/PlaylistActions';
import UserAPI                    from '../../app/js/utils/UserAPI';
import PlaylistAPI                from '../../app/js/utils/PlaylistAPI';

describe('Store: UserEditablePlaylists', function() {

  beforeEach(function() {
    this.userAPIMock = sandbox.mock(UserAPI);
    this.playlistAPIMock = sandbox.mock(PlaylistAPI);
  });

  it('should load user\'s editable playlists on action', function(done) {
    CurrentUserStore.user = {
      id: 1
    };

    this.userAPIMock.expects('getEditablePlaylists').returns(when());

    GlobalActions.loadUserEditablePlaylists();

    done();
  });

  it('should create a new playlist on action', function(done) {
    let playlist = {
      id: 1,
      title: 'test'
    };

    this.playlistAPIMock.expects('create').withArgs(playlist).returns(when());

    PlaylistActions.create(playlist);

    done();
  });

  it('should add a new track to playlist on action', function(done) {
    let playlist = { id: 1 };
    let track = { title: 'test' };

    this.playlistAPIMock.expects('addTrack').withArgs(playlist.id, track).returns(when());

    PlaylistActions.addTrack(playlist, track);

    done();
  });

  it('should call play after adding a new track if changing current playlist', function(done) {
    let playlist = { id: 1 };
    let track = { title: 'test' };
    let spy = sandbox.spy(PlaylistActions, 'play');
    CurrentPlaylistStore.playlist = playlist;

    this.playlistAPIMock.expects('addTrack').withArgs(playlist.id, track).returns(when());

    PlaylistActions.addTrack(playlist, track);

    // TODO: ensure spy was called

    done();
  });

  afterEach(function() {
    this.userAPIMock.restore();
    this.playlistAPIMock.restore();
  });

});