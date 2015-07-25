'use strict';

var PlaylistSearchStore = require('../../app/js/stores/PlaylistSearchStore');
var GlobalActions       = require('../../app/js/actions/GlobalActions');
var SearchAPI           = require('../../app/js/utils/SearchAPI');

describe('Store: PlaylistSearch', function() {

  var mock;

  before(function() {
    mock = sinon.mock(SearchAPI);
  });

  it('should search playlists on action', function(done) {
    var query = 'test';

    mock.expects('playlistSearch').withArgs(query);

    GlobalActions.doPlaylistSearch(query);

    done();
  });

  after(function() {
    mock.restore();
  });

});