'use strict';

import when                 from 'when';
import proxyquire           from 'proxyquire';

import CurrentPlaylistStore from '../../app/js/stores/CurrentPlaylistStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';

const PlaylistAPI = proxyquire('../../app/js/utils/PlaylistAPI', { request: global.requestStub });

console.log('playlistAPI:', PlaylistAPI);

describe('Store: CurrentPlaylist', function() {

  it('should select a playlist on action', function(done) {
    let playlist = { id: 1 };

    sandbox.mock(PlaylistAPI).expects('recordPlay').withArgs(playlist.id).returns(when());

    PlaylistActions.play(playlist, function(selectedPlaylist) {
      selectedPlaylist.should.not.equal(null);
      done();
    });
  });

});