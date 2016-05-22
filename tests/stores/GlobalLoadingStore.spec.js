'use strict';

import GlobalLoadingStore from '../../app/js/stores/GlobalLoadingStore';
import GlobalActions      from '../../app/js/actions/GlobalActions';

describe('Store: GlobalLoading', function() {
  describe('#updateLoadingProgress', function() {
    context('when the action is triggered with progress < 0', function() {
      it('should trigger with this.progress = 0', function(done) {
        sandbox.stub(GlobalLoadingStore, 'trigger', (progress) => {
          assert.strictEqual(progress, 0);
          done();
        });

        GlobalActions.updateLoadingProgress(-5);
      });
    });

    context('when the action is triggered with progress = 100', function() {
      it('should trigger with this.progress = 0', function(done) {
        sandbox.stub(GlobalLoadingStore, 'trigger', (progress) => {
          assert.strictEqual(progress, 0);
          done();
        });

        GlobalActions.updateLoadingProgress(100);
      });
    });

    context('when the action is triggered with progress > 100', function() {
      it('should trigger with this.progress = 0', function(done) {
        sandbox.stub(GlobalLoadingStore, 'trigger', (progress) => {
          assert.strictEqual(progress, 0);
          done();
        });

        GlobalActions.updateLoadingProgress(105);
      });
    });

    context('when the action is triggered with 0 < progress < 100', function() {
      it('should trigger with this.progress = progress', function(done) {
        sandbox.stub(GlobalLoadingStore, 'trigger', (progress) => {
          assert.strictEqual(progress, 50);
          done();
        });

        GlobalActions.updateLoadingProgress(50);
      });
    });
  });
});
