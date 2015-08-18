'use strict';

import when                 from 'when';

import CurrentPlaylistStore from '../../app/js/stores/CurrentPlaylistStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';

describe('Store: CurrentPlaylist', function() {

  beforeEach(function() {
    this.playlistApiMock = sandbox.mock(PlaylistAPI);
  });

  it('should select a playlist on action', function(done) {
    let playlist = { id: 1 };

    this.playlistApiMock.expects('recordPlay').withArgs(playlist.id).returns(when());

    PlaylistActions.play(playlist, function(selectedPlaylist) {
      selectedPlaylist.should.not.equal(null);
      done();
    });
  });

});