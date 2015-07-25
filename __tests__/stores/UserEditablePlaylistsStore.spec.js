'use strict';

var UserEditablePlaylistsStore = require('../../app/js/stores/UserEditablePlaylistsStore');
var CurrentUserStore           = require('../../app/js/stores/CurrentUserStore');
var CurrentPlaylistStore       = require('../../app/js/stores/CurrentPlaylistStore');
var GlobalActions              = require('../../app/js/actions/GlobalActions');
var PlaylistActions            = require('../../app/js/actions/PlaylistActions');
var UserAPI                    = require('../../app/js/utils/UserAPI');
var PlaylistAPI                = require('../../app/js/utils/PlaylistAPI');

describe('Store: UserEditablePlaylists', function() {

  var userAPIMock;
  var playlistAPIMock;

  before(function() {
    userAPIMock = sinon.mock(UserAPI);
    playlistAPIMock = sinon.mock(PlaylistAPI);
  });

  it('should load user\'s editable playlists on action', function(done) {
    CurrentUserStore.user = {
      id: 1
    };

    userAPIMock.expects('getEditablePlaylists');

    GlobalActions.loadUserEditablePlaylists();

    done();
  });

  it('should create a new playlist on action', function(done) {
    var playlist = {
      id: 1,
      title: 'test'
    };

    playlistAPIMock.expects('create').withArgs(playlist);

    PlaylistActions.create(playlist);

    done();
  });

  it('should add a new track to playlist on action', function(done) {
    var playlist = { id: 1 };
    var track = { title: 'test' };

    playlistAPIMock.expects('addTrack').withArgs(playlist.id, track);

    PlaylistActions.addTrack(playlist, track);

    done();
  });

  it('should call play after adding a new track if changing current playlist', function(done) {
    var playlist = { id: 1 };
    var track = { title: 'test' };
    var spy = sinon.spy(PlaylistActions, 'play');
    CurrentPlaylistStore.playlist = playlist;

    playlistAPIMock.expects('addTrack').withArgs(playlist.id, track);

    PlaylistActions.addTrack(playlist, track);

    // TODO: ensure spy was called

    done();
  });

  after(function() {
    userAPIMock.restore();
    playlistAPIMock.restore();
  });

});