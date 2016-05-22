'use strict';

import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';
import CurrentUserStore     from '../../app/js/stores/CurrentUserStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import TrackActions         from '../../app/js/actions/TrackActions';
import PlaybackActions      from '../../app/js/actions/PlaybackActions';
import GlobalActions        from '../../app/js/actions/GlobalActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';
import TrackAPI             from '../../app/js/utils/TrackAPI';
import Mixpanel             from '../../app/js/utils/Mixpanel';
import testHelpers          from '../../utils/testHelpers';
import copyObject           from '../../utils/copyObject';

describe('Store: ViewingPlaylist', function() {

  const playlist = copyObject(testHelpers.fixtures.playlist);
  const track = copyObject(testHelpers.fixtures.playlist);
  const user = copyObject(testHelpers.fixtures.user);

  beforeEach(function() {
    CurrentUserStore.user = user;
    ViewingPlaylistStore.playlist = playlist;
  });

  it('should load a specific playlist on action and log event', function(done) {
    const playlistSlug = playlist.slug;
    const getStub = sandbox.stub(PlaylistAPI, 'get').resolves(playlist);
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.open(playlistSlug, () => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, playlistSlug);
      sinon.assert.calledWith(mixpanelStub, 'view playlist', {
        playlist: playlist
      });
      done();
    });
  });

  it('should sort a playlist on action', function(done) {
    const attr = 'createdAt';

    sandbox.stub(ViewingPlaylistStore, 'trigger', (err, sortedPlaylist) => {
      sortedPlaylist.tracks[0][attr].should.be.below(sortedPlaylist.tracks[1][attr]);
      done();
    });

    PlaybackActions.sortPlaylist(attr, true);
  });

  it('should sort a playlist in reverse order on action', function(done) {
    const attr = 'createdAt';

    sandbox.stub(ViewingPlaylistStore, 'trigger', (err, sortedPlaylist) => {
      sortedPlaylist.tracks[0][attr].should.be.above(sortedPlaylist.tracks[1][attr]);
      done();
    });

    PlaybackActions.sortPlaylist(attr, false);
  });

  it('should update a playlist on action and log event', function(done) {
    const playlistId = playlist.id;
    const updates = {
      title: 'new title'
    };

    sandbox.stub(PlaylistAPI, 'update').resolves();
    sandbox.stub(Mixpanel, 'logEvent');

    sandbox.stub(ViewingPlaylistStore, 'trigger', () => {
      sinon.assert.calledOnce(PlaylistAPI.update);
      sinon.assert.calledWith(PlaylistAPI.update, playlistId, updates);
      sinon.assert.calledWith(Mixpanel.logEvent, 'update playlist', {
        playlistId: playlistId,
        updates: updates
      });
      done();
    });

    PlaylistActions.update(playlistId, updates);
  });

  it('should follow a playlist on action and log event', function(done) {
    const followStub = sandbox.stub(PlaylistAPI, 'follow').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.follow(() => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, playlist.id);
      sinon.assert.calledWith(mixpanelStub, 'follow playlist', {
        playlistId: playlist.id
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

    context('when removing from playlist being viewed', function() {
      beforeEach(function() {
        ViewingPlaylistStore.playlist = playlist;
        ViewingPlaylistStore.playlist.id = 5;
      });

      it('should remove the track and log event', function(done) {
        sandbox.stub(ViewingPlaylistStore, 'trigger', () => {
          sinon.assert.calledOnce(PlaylistAPI.removeTrack);
          sinon.assert.calledWith(PlaylistAPI.removeTrack, playlist.id, track.id);
          sinon.assert.calledOnce(Mixpanel.logEvent);
          sinon.assert.calledWith(Mixpanel.logEvent, 'remove track', {
            playlistId: playlist.id,
            trackId: track.id
          });

          done();
        });

        PlaylistActions.removeTrack(ViewingPlaylistStore.playlist, track);
      });
    });

    context('when not removing from playlist being viewed', function() {
      beforeEach(function() {
        ViewingPlaylistStore.playlist = { id: 5 };
      });

      it('should do nothing', function() {
        PlaylistActions.removeTrack(playlist, track);

        sinon.assert.notCalled(PlaylistAPI.removeTrack);
        sinon.assert.notCalled(Mixpanel.logEvent);
      });
    });
  });

  it('should reorder tracks on action and log event', function(done) {
    const updates = [
      {
        track: track,
        newIndex: 5
      }
    ];

    sandbox.stub(PlaylistAPI, 'reorderTracks').resolves();
    sandbox.stub(Mixpanel, 'logEvent');
    sandbox.stub(GlobalActions, 'triggerSuccessIndicator');

    PlaylistActions.reorderTracks(playlist, updates, () => {
      sinon.assert.calledOnce(PlaylistAPI.reorderTracks);
      sinon.assert.calledWith(PlaylistAPI.reorderTracks, playlist.id, updates);
      sinon.assert.calledOnce(Mixpanel.logEvent);
      sinon.assert.calledWith(Mixpanel.logEvent, 'reorder tracks', {
        playlistId: playlist.id,
        updates: updates
      });
      sinon.assert.calledOnce(GlobalActions.triggerSuccessIndicator);

      done();
    });
  });

  it('should add a collaborator to a playlist on action and log event', function(done) {
    const addCollaboratorStub = sandbox.stub(PlaylistAPI, 'addCollaborator').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.addCollaborator(playlist, user, () => {
      sinon.assert.calledOnce(addCollaboratorStub);
      sinon.assert.calledWith(addCollaboratorStub, playlist.id, user.id);
      sinon.assert.calledWith(mixpanelStub, 'add collaborator', {
        playlistId: playlist.id,
        userId: user.id
      });
      done();
    });
  });

  it('should remove a collaborator from a playlist on action and log event', function(done) {
    const removeCollaboratorStub = sandbox.stub(PlaylistAPI, 'removeCollaborator').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.removeCollaborator(playlist, user, () => {
      sinon.assert.calledOnce(removeCollaboratorStub);
      sinon.assert.calledWith(removeCollaboratorStub, playlist.id, user.id);
      sinon.assert.calledWith(mixpanelStub, 'remove collaborator', {
        playlistId: playlist.id,
        userId: user.id
      });
      done();
    });
  });

  it('should toggle liking current playlist on action and log event', function(done) {
    const likeStub = sandbox.stub(PlaylistAPI, 'like').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.like(() => {
      sinon.assert.calledOnce(likeStub);
      sinon.assert.calledWith(likeStub, playlist.id, user.id);
      sinon.assert.calledWith(mixpanelStub, 'like playlist', {
        playlistId: playlist.id
      });
      done();
    });
  });

  // it('should upvote a track on action and log event', function(done) {
  //   const upvoteStub = sandbox.stub(TrackAPI, 'upvote').resolves();
  //   const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

  //   TrackActions.upvote(track, () => {
  //     sinon.assert.calledOnce(upvoteStub);
  //     sinon.assert.calledWith(upvoteStub, track.id);
  //     sinon.assert.calledWith(mixpanelStub, 'upvote track', {
  //       playlistId: playlist.id,
  //       trackId: track.id
  //     });
  //     done();
  //   });
  // });

  // it('should downvote a track on action and log event', function(done) {
  //   const downvoteStub = sandbox.stub(TrackAPI, 'downvote').resolves();
  //   const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

  //   TrackActions.downvote(track, () => {
  //     sinon.assert.calledOnce(downvoteStub);
  //     sinon.assert.calledWith(downvoteStub, track.id);
  //     sinon.assert.calledWith(mixpanelStub, 'downvote track', {
  //       playlistId: playlist.id,
  //       trackId: track.id
  //     });
  //     done();
  //   });
  // });

  it('should add a track comment on action and log event', function(done) {
    const commentBody = 'Test comment';
    const addCommentStub = sandbox.stub(TrackAPI, 'addComment').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    TrackActions.addComment(commentBody, track, () => {
      sinon.assert.calledOnce(addCommentStub);
      sinon.assert.calledWith(addCommentStub, track.id, commentBody);
      sinon.assert.calledWith(mixpanelStub, 'add track comment', {
        playlistId: playlist.id,
        trackId: track.id,
        comment: commentBody
      });
      done();
    });
  });

  it('should remove a track comment on action and log event', function(done) {
    const commentId = 1;
    const removeCommentStub = sandbox.stub(TrackAPI, 'removeComment').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    TrackActions.removeComment(track.id, commentId, () => {
      sinon.assert.calledOnce(removeCommentStub);
      sinon.assert.calledWith(removeCommentStub, track.id, commentId);
      sinon.assert.calledWith(mixpanelStub, 'remove track comment', {
        playlistId: playlist.id,
        trackId: track.id,
        commentId: commentId
      });
      done();
    });
  });

  it('should identify all tracks on action', function(done) {
    sandbox.stub(PlaylistAPI, 'identifyTracks').resolves();

    PlaylistActions.identifyTracks(playlist.id, () => {
      sinon.assert.calledOnce(PlaylistAPI.identifyTracks);
      sinon.assert.calledWith(PlaylistAPI.identifyTracks, playlist.id);
      done();
    });
  });

});
