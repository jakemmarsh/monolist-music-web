'use strict';

import testHelpers       from '../../utils/testHelpers';
import copyObject        from '../../utils/copyObject';
import CurrentTrackStore from '../../app/js/stores/CurrentTrackStore';
import TrackActions      from '../../app/js/actions/TrackActions';
import Mixpanel          from '../../app/js/utils/Mixpanel';
import TrackAPI          from '../../app/js/utils/TrackAPI';

describe('Store: CurrentTrack', function() {

  const TRACK = testHelpers.fixtures.track;
  const USER = testHelpers.fixtures.user;
  const INDEX = 1;

  beforeEach(function() {
    sandbox.stub(Mixpanel, 'logEvent');
  });

  it('should set a new track on action and log event', function(done) {
    sandbox.stub(CurrentTrackStore, 'trigger', (newTrack, newIndex) => {
      assert.deepEqual(newTrack, TRACK);
      assert.strictEqual(INDEX, newIndex);

      sinon.assert.calledOnce(Mixpanel.logEvent);
      sinon.assert.calledWith(Mixpanel.logEvent, 'play track', {
        track: TRACK
      });

      done();
    });

    TrackActions.select(TRACK, INDEX);
  });

  describe('voting', function() {
    beforeEach(function() {
      CurrentTrackStore.track = copyObject(TRACK);
      CurrentTrackStore.currentIndex = copyObject(INDEX);
    });

    it('should upvote a track on action and log event', function(done) {
      const expectedTrack = copyObject(TRACK);
      expectedTrack.upvotes.push({
        userId: USER.id,
        trackId: TRACK.id
      });

      sandbox.stub(TrackAPI, 'upvote').resolves();

      sandbox.stub(CurrentTrackStore, 'trigger', (newTrack, newIndex) => {
        assert.deepEqual(newTrack, expectedTrack);
        assert.strictEqual(INDEX, newIndex);

        sinon.assert.calledOnce(TrackAPI.upvote);
        sinon.assert.calledWith(TrackAPI.upvote, TRACK.id);
        sinon.assert.calledOnce(Mixpanel.logEvent);
        sinon.assert.calledWith(Mixpanel.logEvent, 'upvote track', {
          track: TRACK
        });

        done();
      });

      TrackActions.upvote(TRACK, USER);
    });

    it('should downvote a track on action and log event', function(done) {
      const expectedTrack = copyObject(TRACK);
      expectedTrack.downvotes.push({
        userId: USER.id,
        trackId: TRACK.id
      });

      sandbox.stub(TrackAPI, 'downvote').resolves();

      sandbox.stub(CurrentTrackStore, 'trigger', (newTrack, newIndex) => {
        assert.deepEqual(newTrack, expectedTrack);
        assert.strictEqual(INDEX, newIndex);

        sinon.assert.calledOnce(TrackAPI.downvote);
        sinon.assert.calledWith(TrackAPI.downvote, TRACK.id);
        sinon.assert.calledOnce(Mixpanel.logEvent);
        sinon.assert.calledWith(Mixpanel.logEvent, 'downvote track', {
          track: TRACK
        });

        done();
      });

      TrackActions.downvote(TRACK, USER);
    });
  });
});
