'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';

const ModalStore = Reflux.createStore({

  init() {
    this.modalClass = null;
    this.modalContents = null;

    this.listenTo(GlobalActions.openModal, this.open);
    this.listenTo(GlobalActions.closeModal, this.close);
  },

  open(modalClass, modalContents) {
    this.modalClass = modalClass || null;
    this.modalContents = modalContents;
    this.trigger(this.modalClass, this.modalContents);
  },

  close() {
    this.modalClass = null;
    this.modalContents = null;
    this.trigger(this.modalClass, this.modalContents);
  }

});

export default ModalStore;
