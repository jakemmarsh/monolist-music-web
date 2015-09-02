'use strict';

import when        from 'when';

import PostActions from '../../app/js/actions/PostActions';
import PostAPI     from '../../app/js/utils/PostAPI';

describe('Store: ViewingPost', function() {

  beforeEach(function() {
    this.postAPIMock = sandbox.mock(PostAPI);
  });

  it('should load a specific playlist on action', function(done) {
    let postId = 1;

    this.postAPIMock.expects('get').withArgs(postId).returns(when());

    PostActions.open(postId);

    done();
  });

});