'use strict';

import CurrentPlaylistStore from '../../app/js/stores/CurrentPlaylistStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';
import Mixpanel             from '../../app/js/utils/Mixpanel';

import testHelpers          from '../../utils/testHelpers';
import copyObject           from '../../utils/copyObject';

describe('Store: CurrentPlaylist', function() {

  beforeEach(function() {
    CurrentPlaylistStore.playlist = null;
  });

  it('should select a playlist on action and log event', function(done) {
    const playlist = { id: 1 };
    const recordPlayStub = sandbox.stub(PlaylistAPI, 'recordPlay').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.play(playlist, (selectedPlaylist) => {
      selectedPlaylist.should.not.equal(null);
      sinon.assert.calledOnce(recordPlayStub);
      sinon.assert.calledWith(recordPlayStub, playlist.id);
      sinon.assert.calledWith(mixpanelStub, 'play playlist', {
        playlist: playlist
      });
      done();
    });
  });

  describe('removing track', function() {
    const playlist = copyObject(testHelpers.fixtures.playlist);
    const track = copyObject(testHelpers.fixtures.track);

    beforeEach(function() {
      sandbox.stub(PlaylistAPI, 'removeTrack').resolves();
      sandbox.stub(Mixpanel, 'logEvent');
    });

    context('when removing from current playlist', function() {
      beforeEach(function() {
        CurrentPlaylistStore.playlist = playlist;
      });

      it('should remove the track and log event', function(done) {
        PlaylistActions.removeTrack(playlist, track, () => {
          sinon.assert.calledOnce(PlaylistAPI.removeTrack);
          sinon.assert.calledWith(PlaylistAPI.removeTrack, playlist.id, track.id);
          sinon.assert.calledOnce(Mixpanel.logEvent);
          sinon.assert.calledWith(Mixpanel.logEvent, 'remove track', {
            playlistId: playlist.id,
            trackId: track.id
          });
          done();
        });
      });
    });

    context('when not removing from current playlist', function() {
      beforeEach(function() {
        CurrentPlaylistStore.playlist = { id: 5 };
      });

      it('should do nothing', function(done) {
        PlaylistActions.removeTrack(playlist, track, () => {
          sinon.assert.notCalled(PlaylistAPI.removeTrack);
          sinon.assert.notCalled(Mixpanel.logEvent);
          done();
        });
      });
    });
  });

});
