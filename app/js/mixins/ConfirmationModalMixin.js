'use strict';

import React         from 'react';

import GlobalActions from '../actions/GlobalActions';

const EditGroupModalMixin = {

  handleConfirmation(cb) {
    cb();
    GlobalActions.closeModal();
  },

  openConfirmationModal(prompt, cb) {
    GlobalActions.openModal('confirmation',
      <div>
        <h5 className="nudge--bottom">{prompt}</h5>

        <div className="pure-g">
          <div className="pure-u-1-2 soft-half--right">
            <button type="button" className="btn red full" onClick={this.handleConfirmation.bind(null, cb)}>Yes</button>
          </div>
          <div className="pure-u-1-2 soft-half--left">
            <button type="button" className="btn full" onClick={GlobalActions.closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

};

export default EditGroupModalMixin;
