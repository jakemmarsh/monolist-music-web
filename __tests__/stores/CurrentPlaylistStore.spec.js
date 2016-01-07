'use strict';

import when                 from 'when';

import CurrentPlaylistStore from '../../app/js/stores/CurrentPlaylistStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';

describe('Store: CurrentPlaylist', function() {

  beforeEach(function() {
    CurrentPlaylistStore.playlist = null;
  });

  it('should select a playlist on action', function(done) {
    const playlist = { id: 1 };
    const recordPlayStub = sandbox.stub(PlaylistAPI, 'recordPlay').returns(when());

    PlaylistActions.play(playlist, (selectedPlaylist) => {
      selectedPlaylist.should.not.equal(null);
      sinon.assert.calledOnce(recordPlayStub);
      sinon.assert.calledWith(recordPlayStub, playlist.id);
      done();
    });
  });

});