'use strict';

var TrackSearchStore = require('../../app/js/stores/TrackSearchStore');
var GlobalActions    = require('../../app/js/actions/GlobalActions');
var SearchAPI        = require('../../app/js/utils/SearchAPI');

describe('Store: TrackSearch', function() {

  var mock;

  before(function() {
    mock = sinon.mock(SearchAPI);
  });

  it('should search tracks on action', function(done) {
    var query = 'test';

    mock.expects('trackSearch').withArgs(query);

    GlobalActions.doTrackSearch(query);

    done();
  });

  after(function() {
    mock.restore();
  });

});