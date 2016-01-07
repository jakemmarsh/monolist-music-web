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
    const getEditablePlaylistsStub = sandbox.stub(UserAPI, 'getEditablePlaylists').returns(when());

    GlobalActions.loadUserEditablePlaylists(() => {
      sinon.assert.calledOnce(getEditablePlaylistsStub);
      done();
    });
  });

  it('should create a new playlist on action', function(done) {
    const playlist = {
      id: 1,
      title: 'test'
    };
    const createStub = sandbox.stub(PlaylistAPI, 'create').returns(when());

    PlaylistActions.create(playlist, () => {
      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, playlist);
      done();
    });
  });

  it('should add a new track to playlist on action', function(done) {
    const playlist = { id: 1 };
    const track = { title: 'test' };
    const addTrackStub = sandbox.stub(PlaylistAPI, 'addTrack').returns(when(playlist));

    PlaylistActions.addTrack(playlist, track, () => {
      sinon.assert.calledOnce(addTrackStub);
      sinon.assert.calledWith(addTrackStub, playlist.id, track);
      done();
    });
  });

  it('should call play after adding a new track if changing current playlist', function(done) {
    const playlist = { id: 1 };
    const track = { title: 'test' };
    const addTrackStub = sandbox.stub(PlaylistAPI, 'addTrack').returns(when(playlist));
    const playStub = sandbox.stub(PlaylistActions, 'play');

    CurrentPlaylistStore.playlist = playlist;

    PlaylistActions.addTrack(playlist, track, () => {
      sinon.assert.calledOnce(addTrackStub);
      sinon.assert.calledWith(addTrackStub, playlist.id, track);
      sinon.assert.calledOnce(playStub);
      done();
    });
  });

});