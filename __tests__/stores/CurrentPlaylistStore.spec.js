'use strict';

import CurrentPlaylistStore from '../../app/js/stores/CurrentPlaylistStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';

describe('Store: CurrentPlaylist', function() {

  beforeEach(function() {
    this.playlistApiMock = sinon.mock(PlaylistAPI);
  });

  it('should select a playlist on action', function(done) {
    let playlist = { id: 1 };

    this.playlistApiMock.expects('recordPlay').withArgs(playlist.id);

    PlaylistActions.play(playlist, function(selectedPlaylist) {
      selectedPlaylist.should.not.equal(null);
      done();
    });
  });

  afterEach(function() {
    this.playlistApiMock.restore();
  });

});