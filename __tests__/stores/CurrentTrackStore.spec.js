'use strict';

var CurrentTrackStore = require('../../app/js/stores/CurrentTrackStore');
var TrackActions      = require('../../app/js/actions/TrackActions');

describe('Store: CurrentTrack', () => {

  it('should set a new track on action', done => {
    var track = {
      id: 1,
      title: 'test'
    };
    var index = 1;

    TrackActions.select(track, index, (newTrack, newIndex) => {
      track.should.equal(newTrack);
      index.should.equal(newIndex);
      done();
    });
  });

});