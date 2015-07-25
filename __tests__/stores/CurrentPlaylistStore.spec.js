'use strict';

var CurrentPlaylistStore = require('../../app/js/stores/CurrentPlaylistStore');
var PlaylistActions      = require('../../app/js/actions/PlaylistActions');
var PlaylistAPI          = require('../../app/js/utils/PlaylistAPI');

describe('Store: CurrentPlaylist', function() {

  var mock;

  before(function() {
    mock = sinon.mock(PlaylistAPI);
  });

  it('should select a playlist on action', function(done) {
    var playlist = { id: 1 };

    mock.expects('recordPlay').withArgs(playlist.id);

    PlaylistActions.play(playlist, function(selectedPlaylist) {
      selectedPlaylist.should.not.equal(null);
      done();
    });
  });

  after(function() {
    mock.restore();
  });

});