'use strict';

import Modals        from '../../app/js/utils/Modals';
import GlobalActions from '../../app/js/actions/GlobalActions';
import testHelpers   from '../../utils/testHelpers';
import copyObject    from '../../utils/copyObject';

describe('Util: Modals', function() {

  let playlist;
  let user;
  let track;
  let group;

  beforeEach(function() {
    playlist = copyObject(testHelpers.fixtures.playlist);
    user = copyObject(testHelpers.fixtures.user);
    track = copyObject(testHelpers.fixtures.track);
    group = copyObject(testHelpers.fixtures.group);
    sandbox.stub(GlobalActions, 'openModal');
  });

  describe('#openUserSearch', function() {
    it('should call the openModal action', function() {
      Modals.openUserSearch([], {}, () => {}, () => {}, () => {});

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'user-search', testHelpers.isJsx);
    });
  });

  describe('#openAddTrackByUrl', function() {
    it('should call the openModal action', function() {
      Modals.openAddTrackByUrl(playlist, user);

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'add-track-from-url', testHelpers.isJsx);
    });
  });

  describe('#openEditGroup', function() {
    it('should call the openModal action', function() {
      Modals.openEditGroup(group);

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'edit-group', testHelpers.isJsx);
    });
  });

  describe('#openEditPlaylist', function() {
    it('should call the openModal action', function() {
      Modals.openEditPlaylist(playlist);

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'edit-playlist', testHelpers.isJsx);
    });
  });

  describe('#openShare', function() {
    it('should call the openModal action', function() {
      Modals.openShare(playlist);

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'share', testHelpers.isJsx);
    });
  });

  describe('#openConfirmation', function() {
    it('should call the openModal action', function() {
      Modals.openConfirmation('Test prompt', () => {});

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'confirmation', testHelpers.isJsx);
    });
  });

  describe('#openLogin', function() {
    it('should call the openModal action', function() {
      Modals.openLogin();

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'login', testHelpers.isJsx);
    });
  });

  describe('#openFlashError', function() {
    it('should call the openModal action', function() {
      Modals.openFlashError();

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'flash-warning error', testHelpers.isJsx);
    });
  });

  describe('#openYouTubeError', function() {
    it('should call the openModal action', function() {
      Modals.openYouTubeError(100, track, playlist, user);

      sinon.assert.calledOnce(GlobalActions.openModal);
      sinon.assert.calledWith(GlobalActions.openModal, 'youtube-error error', testHelpers.isJsx);
    });
  });

});
