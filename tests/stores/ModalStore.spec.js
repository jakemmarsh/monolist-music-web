'use strict';

import React         from 'react';

import ModalStore    from '../../app/js/stores/ModalStore';
import GlobalActions from '../../app/js/actions/GlobalActions';

describe('Store: Modal', function() {

  it('should set modal class and contents then trigger on open action', function(done) {
    const modalClass = 'test-class';
    const modalContents = (<div />);
    const triggerStub = sandbox.stub(ModalStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, modalClass, modalContents);
      done();
    });

    GlobalActions.openModal(modalClass, modalContents);
  });

  it('should reset modal class and contents then trigger on close action', function(done) {
    const triggerStub = sandbox.stub(ModalStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, null, null);
      done();
    });

    GlobalActions.closeModal();
  });

});
