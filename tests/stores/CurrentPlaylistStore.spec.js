'use strict';

import CurrentPlaylistStore from '../../app/js/stores/CurrentPlaylistStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';
import Mixpanel             from '../../app/js/utils/Mixpanel';

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

});
