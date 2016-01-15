'use strict';

import when                 from 'when';

import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';
import CurrentUserStore     from '../../app/js/stores/CurrentUserStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import TrackActions         from '../../app/js/actions/TrackActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';
import TrackAPI             from '../../app/js/utils/TrackAPI';
import Mixpanel             from '../../app/js/utils/Mixpanel';
import TestHelpers          from '../../utils/testHelpers';

describe('Store: ViewingPlaylist', function() {

  const playlist = JSON.parse(JSON.stringify(TestHelpers.fixtures.playlist));
  const track = JSON.parse(JSON.stringify(TestHelpers.fixtures.playlist));
  const user = JSON.parse(JSON.stringify(TestHelpers.fixtures.user));

  beforeEach(function() {
    CurrentUserStore.user = user;
    ViewingPlaylistStore.playlist = playlist;
  });

  it('should load a specific playlist on action and log event', function(done) {
    const playlistSlug = playlist.slug;
    const getStub = sandbox.stub(PlaylistAPI, 'get').returns(when(playlist));
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

  it('should update a playlist on action and log evnet', function(done) {
    const playlistId = playlist.id;
    const updates = {
      title: 'new title'
    };
    const updateStub = sandbox.stub(PlaylistAPI, 'update').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.update(playlistId, updates, () => {
      sinon.assert.calledOnce(updateStub);
      sinon.assert.calledWith(updateStub, playlistId, updates);
      sinon.assert.calledWith(mixpanelStub, 'update playlist', {
        playlistId: playlistId,
        updates: updates
      });
      done();
    });
  });

  it('should follow a playlist on action and log event', function(done) {
    const followStub = sandbox.stub(PlaylistAPI, 'follow').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.follow(playlist, () => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, playlist.id);
      sinon.assert.calledWith(mixpanelStub, 'follow playlist', {
        playlistId: playlist.id
      });
      done();
    });
  });

  it('should remove a track from a playlist on action and log event', function(done) {
    const removeTrackStub = sandbox.stub(PlaylistAPI, 'removeTrack').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.removeTrack(playlist, track, () => {
      sinon.assert.calledOnce(removeTrackStub);
      sinon.assert.calledWith(removeTrackStub, playlist.id, track.id);
      sinon.assert.calledWith(mixpanelStub, 'remove track', {
        playlistId: playlist.id,
        trackId: track.id
      });
      done();
    });
  });

  it('should add a collaborator to a playlist on action and log event', function(done) {
    const addCollaboratorStub = sandbox.stub(PlaylistAPI, 'addCollaborator').returns(when());
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
    const removeCollaboratorStub = sandbox.stub(PlaylistAPI, 'removeCollaborator').returns(when());
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
    const likeStub = sandbox.stub(PlaylistAPI, 'like').returns(when());
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

  it('should upvote a track on action and log event', function(done) {
    const upvoteStub = sandbox.stub(TrackAPI, 'upvote').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    TrackActions.upvote(track, () => {
      sinon.assert.calledOnce(upvoteStub);
      sinon.assert.calledWith(upvoteStub, track.id);
      sinon.assert.calledWith(mixpanelStub, 'upvote track', {
        playlistId: playlist.id,
        trackId: track.id
      });
      done();
    });
  });

  it('should downvote a track on action and log event', function(done) {
    const downvoteStub = sandbox.stub(TrackAPI, 'downvote').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    TrackActions.downvote(track, () => {
      sinon.assert.calledOnce(downvoteStub);
      sinon.assert.calledWith(downvoteStub, track.id);
      sinon.assert.calledWith(mixpanelStub, 'downvote track', {
        playlistId: playlist.id,
        trackId: track.id
      });
      done();
    });
  });

  it('should add a track comment on action and log event', function(done) {
    const commentBody = 'Test comment';
    const addCommentStub = sandbox.stub(TrackAPI, 'addComment').returns(when());
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
    const removeCommentStub = sandbox.stub(TrackAPI, 'removeComment').returns(when());
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

  it('should delete a playlist on action and log event', function(done) {
    const deleteStub = sandbox.stub(PlaylistAPI, 'delete').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    PlaylistActions.delete(playlist, () => {
      sinon.assert.calledOnce(deleteStub);
      sinon.assert.calledWith(deleteStub, playlist.id);
      sinon.assert.calledWith(mixpanelStub, 'delete playlist', {
        playlistId: playlist.id
      });
      done();
    });
  });

});