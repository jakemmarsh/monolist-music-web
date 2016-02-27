'use strict';

import PlaybackStore   from '../../app/js/stores/PlaybackStore';
import PlaybackActions from '../../app/js/actions/PlaybackActions';

describe('Store: ViewingPlaylist', function() {

  it('should trigger on updateVolume action', function(done) {
    const newVolume = 0.5;
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'updateVolume', newVolume);
      done();
    });

    PlaybackActions.updateVolume(newVolume);
  });

  it('should trigger on seek action', function(done) {
    const newTime = 123;
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'seek', newTime);
      done();
    });

    PlaybackActions.seek(newTime);
  });

  it('should trigger on previousTrack action', function(done) {
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'previousTrack');
      done();
    });

    PlaybackActions.previousTrack();
  });

  it('should trigger on nextTrack action', function(done) {
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'nextTrack');
      done();
    });

    PlaybackActions.nextTrack();
  });

  it('should trigger on togglePlay action', function(done) {
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'togglePlay');
      done();
    });

    PlaybackActions.togglePlay();
  });

  it('should trigger on toggleRepeat action', function(done) {
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'toggleRepeat');
      done();
    });

    PlaybackActions.toggleRepeat();
  });

  it('should trigger on toggleShuffle action', function(done) {
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'toggleShuffle');
      done();
    });

    PlaybackActions.toggleShuffle();
  });

  it('should trigger on sortPlaylist action', function(done) {
    const key = 'testKey';
    const asc = false;
    const triggerStub = sandbox.stub(PlaybackStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, 'sortPlaylist', key, asc);
      done();
    });

    PlaybackActions.sortPlaylist(key, asc);
  });

});
