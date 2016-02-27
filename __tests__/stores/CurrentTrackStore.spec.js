'use strict';

import CurrentTrackStore from '../../app/js/stores/CurrentTrackStore';
import TrackActions      from '../../app/js/actions/TrackActions';
import Mixpanel          from '../../app/js/utils/Mixpanel';

describe('Store: CurrentTrack', function() {

  it('should set a new track on action and log event', function(done) {
    const track = {
      id: 1,
      title: 'test'
    };
    const index = 1;
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    sandbox.stub(CurrentTrackStore, 'trigger', (newTrack, newIndex) => {
      track.should.equal(newTrack);
      index.should.equal(newIndex);

      sinon.assert.calledWith(mixpanelStub, 'play track', {
        track: track
      });

      done();
    });

    TrackActions.select(track, index);
  });
});