'use strict';

import when                 from 'when';

import ViewingPlaylistStore from '../../app/js/stores/ViewingPlaylistStore';
import CurrentUserStore     from '../../app/js/stores/CurrentUserStore';
import PlaylistActions      from '../../app/js/actions/PlaylistActions';
import TrackActions         from '../../app/js/actions/TrackActions';
import PlaylistAPI          from '../../app/js/utils/PlaylistAPI';
import TrackAPI             from '../../app/js/utils/TrackAPI';
import TestHelpers          from '../../utils/testHelpers';

describe('Store: ViewingPlaylist', function() {

  const playlist = JSON.parse(JSON.stringify(TestHelpers.fixtures.playlist));
  const track = JSON.parse(JSON.stringify(TestHelpers.fixtures.playlist));
  const user = JSON.parse(JSON.stringify(TestHelpers.fixtures.user));

  beforeEach(function() {
    CurrentUserStore.user = user;
    ViewingPlaylistStore.playlist = playlist;
  });

  it('should load a specific playlist on action', function(done) {
    const playlistSlug = playlist.slug;
    const getStub = sandbox.stub(PlaylistAPI, 'get').returns(when(playlist));

    PlaylistActions.open(playlistSlug, () => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, playlistSlug);
      done();
    });
  });

  it('should update a group on action', function(done) {
    const playlistId = playlist.id;
    const updates = {
      title: 'new title'
    };
    const updateStub = sandbox.stub(PlaylistAPI, 'update').returns(when());

    PlaylistActions.update(playlistId, updates, () => {
      sinon.assert.calledOnce(updateStub);
      sinon.assert.calledWith(updateStub, playlistId, updates);
      done();
    });
  });

  it('should follow a playlist on action', function(done) {
    const followStub = sandbox.stub(PlaylistAPI, 'follow').returns(when());

    PlaylistActions.follow(playlist, () => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, playlist.id);
      done();
    });
  });

  it('should remove a track from a playlist on action', function(done) {
    const removeTrackStub = sandbox.stub(PlaylistAPI, 'removeTrack').returns(when());

    PlaylistActions.removeTrack(playlist, track, () => {
      sinon.assert.calledOnce(removeTrackStub);
      sinon.assert.calledWith(removeTrackStub, playlist.id, track.id);
      done();
    });
  });

  it('should add a collaborator to a playlist on action', function(done) {
    const addCollaboratorStub = sandbox.stub(PlaylistAPI, 'addCollaborator').returns(when());

    PlaylistActions.addCollaborator(playlist, user, () => {
      sinon.assert.calledOnce(addCollaboratorStub);
      sinon.assert.calledWith(addCollaboratorStub, playlist.id, user.id);
      done();
    });
  });

  it('should remove a collaborator from a playlist on action', function(done) {
    const removeCollaboratorStub = sandbox.stub(PlaylistAPI, 'removeCollaborator').returns(when());

    PlaylistActions.removeCollaborator(playlist, user, () => {
      sinon.assert.calledOnce(removeCollaboratorStub);
      sinon.assert.calledWith(removeCollaboratorStub, playlist.id, user.id);
      done();
    });
  });

  it('should toggle liking current playlist on action', function(done) {
    const likeStub = sandbox.stub(PlaylistAPI, 'like').returns(when());

    PlaylistActions.like(() => {
      sinon.assert.calledOnce(likeStub);
      sinon.assert.calledWith(likeStub, playlist.id, user.id);
      done();
    });
  });

  it('should add a track comment on action', function(done) {
    const commentBody = 'Test comment';
    const addCommentStub = sandbox.stub(TrackAPI, 'addComment').returns(when());

    TrackActions.addComment(commentBody, track, () => {
      sinon.assert.calledOnce(addCommentStub);
      sinon.assert.calledWith(addCommentStub, track.id, commentBody);
      done();
    });
  });

  it('should remove a track comment on action', function(done) {
    const commentId = 1;
    const removeCommentStub = sandbox.stub(TrackAPI, 'removeComment').returns(when());

    TrackActions.removeComment(track.id, commentId, () => {
      sinon.assert.calledOnce(removeCommentStub);
      sinon.assert.calledWith(removeCommentStub, track.id, commentId);
      done();
    });
  });

  it('should delete a playlist on action', function(done) {
    const deleteStub = sandbox.stub(PlaylistAPI, 'delete').returns(when());

    PlaylistActions.delete(playlist, () => {
      sinon.assert.calledOnce(deleteStub);
      sinon.assert.calledWith(deleteStub, playlist.id);
      done();
    });
  });

});