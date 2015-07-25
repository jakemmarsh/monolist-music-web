'use strict';

var GroupsStore      = require('../../app/js/stores/GroupsStore');
var CurrentUserStore = require('../../app/js/stores/CurrentUserStore');
var GlobalActions    = require('../../app/js/actions/GlobalActions');
var GroupActions     = require('../../app/js/actions/GroupActions');
var UserAPI          = require('../../app/js/utils/UserAPI');
var GroupAPI         = require('../../app/js/utils/GroupAPI');
var SearchAPI        = require('../../app/js/utils/SearchAPI');

describe('Store: Groups', function() {

  var userAPIMock;
  var groupAPIMock;
  var searchAPIMock;

  before(function() {
    userAPIMock = sinon.mock(UserAPI);
    groupAPIMock = sinon.mock(GroupAPI);
    searchAPIMock = sinon.mock(SearchAPI);
  });

  it('should load trending groups on action if no user', function(done) {
    groupAPIMock.expects('getTrending');

    GlobalActions.loadGroups();

    done();
  });

  it('should load trending and user groups on action', function(done) {
    CurrentUserStore.user = {
      id: 1
    };

    groupAPIMock.expects('getTrending');
    userAPIMock.expects('getGroups').withArgs(CurrentUserStore.user.id);

    GlobalActions.loadGroups();

    done();
  });

  it('should search all groups on action', function(done) {
    var query = 'test';

    searchAPIMock.expects('groupSearch').withArgs(query);

    GroupActions.search(query);

    done();
  });

  after(function() {
    userAPIMock.restore();
    groupAPIMock.restore();
    searchAPIMock.restore();
  });

});