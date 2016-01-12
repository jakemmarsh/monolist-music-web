'use strict';

import GlobalActionIndicatorStore from '../../app/js/stores/GlobalActionIndicatorStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';

describe('Store: GlobalActionIndicator', function() {

  it('should trigger on success action', function(done) {
    const triggerStub = sandbox.stub(GlobalActionIndicatorStore, 'trigger', function() {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, true);

      done();
    });

    GlobalActions.triggerSuccessIndicator();
  });

  it('should trigger on failure action', function(done) {
    const triggerStub = sandbox.stub(GlobalActionIndicatorStore, 'trigger', function() {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, false);

      done();
    });

    GlobalActions.triggerFailureIndicator();
  });

});
