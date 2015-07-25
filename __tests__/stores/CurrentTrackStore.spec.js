'use strict';

var CurrentTrackStore = require('../../app/js/stores/CurrentTrackStore');
var TrackActions      = require('../../app/js/actions/TrackActions');

describe('Store: CurrentTrack', function() {

  it('should set a new track on action', function(done) {
    var track = {
      id: 1,
      title: 'test'
    };
    var index = 1;

    TrackActions.select(track, index, function(track, index) {
      track.should.equal(track);
      index.should.equal(index);
      done();
    });
  });

});