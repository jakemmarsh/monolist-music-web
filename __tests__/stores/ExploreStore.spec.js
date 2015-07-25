'use strict';

var ExploreStore  = require('../../app/js/stores/ExploreStore');
var GlobalActions = require('../../app/js/actions/GlobalActions');
var ExploreAPI    = require('../../app/js/utils/ExploreAPI');

describe('Store: Explore', function() {

  var mock;

  before(function() {
    mock = sinon.mock(ExploreAPI);
  });

  it('should load all explore playlists on action', function(done) {
    mock.expects('getTrending');
    mock.expects('getNewest');

    GlobalActions.loadExplorePlaylists();

    done();
  });

  after(function() {
    mock.restore();
  });

});