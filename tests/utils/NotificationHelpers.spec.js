'use strict';

import NotificationHelpers from '../../app/js/utils/NotificationHelpers';

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

});
