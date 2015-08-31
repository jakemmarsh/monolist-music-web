'use strict';

import NotificationHelpers from '../../app/js/utils/NotificationHelpers';
import GroupAPI            from '../../app/js/utils/GroupAPI';
import PlaylistAPI         from '../../app/js/utils/PlaylistAPI';

describe('Util: NotificationHelpers', function() {

  it('should have a map of actions to complete wording', function(done) {
    Should.exist(NotificationHelpers.verbMap);

    // TODO: check each individual key/value?

    done();
  });

  it('should have a map of entity types to URL paths', function(done) {
    Should.exist(NotificationHelpers.entityPathMap);

    Should(NotificationHelpers.entityPathMap['group']).eql('/group/');
    Should(NotificationHelpers.entityPathMap['playlist']).eql('/playlist/');
    Should(NotificationHelpers.entityPathMap['user']).eql('/profile/');

    done();
  });

  it('should have a map of entity types to retrieval functions', function(done) {
    Should.exist(NotificationHelpers.retrievalMap);

    Should(NotificationHelpers.retrievalMap['group']).eql(GroupAPI.get);
    Should(NotificationHelpers.retrievalMap['playlist']).eql(PlaylistAPI.get);

    done();
  });

  it('#getRelatedEntity should get the entity related to a notification', function(done) {
    let groupId = 1;

    sandbox.mock(GroupAPI).expects('get').once().withArgs(groupId);

    NotificationHelpers.getRelatedEntity('group', groupId);

    done();
  });

});