'use strict';

import React         from 'react';

import ModalStore    from '../../app/js/stores/ModalStore';
import GlobalActions from '../../app/js/actions/GlobalActions';

describe('Store: Modal', function() {

  it('should set modal class and contents then trigger on open action', function() {
    const modalClass = 'test-class';
    const modalContents = (<div />);
    const triggerStub = sandbox.stub(ModalStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, modalClass, modalContents);
    });

    GlobalActions.openModal(modalClass, modalContents);
  });

  it('should reset modal class and contents then trigger on close action', function() {
    const triggerStub = sandbox.stub(ModalStore, 'trigger', () => {
      sinon.assert.calledOnce(triggerStub);
      sinon.assert.calledWith(triggerStub, null, null);
    });

    GlobalActions.closeModal();
  });

});
