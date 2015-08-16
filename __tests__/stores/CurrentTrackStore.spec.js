'use strict';

import CurrentTrackStore from '../../app/js/stores/CurrentTrackStore';
import TrackActions      from '../../app/js/actions/TrackActions';

describe('Store: CurrentTrack', function() {

  it('should set a new track on action', function(done) {
    let track = {
      id: 1,
      title: 'test'
    };
    let index = 1;

    TrackActions.select(track, index, function(newTrack, newIndex) {
      track.should.equal(newTrack);
      index.should.equal(newIndex);
      done();
    });
  });

});