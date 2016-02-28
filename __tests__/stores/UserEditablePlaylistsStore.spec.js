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
import Mixpanel                   from '../../app/js/utils/Mixpanel';

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

  it('should create a new playlist on action and log event', function(done) {
    const playlist = {
      id: 1,
      title: 'test'
    };
    const createStub = sandbox.stub(PlaylistAPI, 'create').returns(when(playlist));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.create(playlist, () => {
      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, playlist);
      sinon.assert.calledWith(mixpanelStub, 'create playlist', {
        playlist: playlist
      });
      done();
    });
  });

  it('should update playlist in array on action', function(done) {
    const playlist = TestHelpers.fixtures.playlist;

    UserEditablePlaylistsStore.playlists = [playlist];

    sandbox.stub(UserEditablePlaylistsStore, 'trigger', (err, playlists) => {
      playlists[0].slug.should.equal('new-slug');
      done();
    });

    PlaylistActions.update(playlist.id, { slug: 'new-slug' });
  });

  it('should add a new track to playlist on action and log event', function(done) {
    const playlist = { id: 1 };
    const track = { title: 'test' };
    const addTrackStub = sandbox.stub(PlaylistAPI, 'addTrack').returns(when(playlist));
    const successIndicatorStub = sandbox.stub(GlobalActions, 'triggerSuccessIndicator');
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.addTrack(playlist, track, () => {
      sinon.assert.calledOnce(addTrackStub);
      sinon.assert.calledWith(addTrackStub, playlist.id, track);
      sinon.assert.calledOnce(successIndicatorStub);
      sinon.assert.calledWith(mixpanelStub, 'add track', {
        playlistId: playlist.id,
        track: track
      });
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

  it('should delete a playlist on action and log event', function(done) {
    const playlist = { id: 1 };
    const deleteStub = sandbox.stub(PlaylistAPI, 'delete').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.delete(playlist, () => {
      sinon.assert.calledOnce(deleteStub);
      sinon.assert.calledWith(deleteStub, playlist.id);
      sinon.assert.calledWith(mixpanelStub, 'delete playlist', {
        playlistId: playlist.id
      });
      done();
    });
  });

});