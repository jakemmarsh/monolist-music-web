'use strict';

import React         from 'react';

import GlobalActions from '../actions/GlobalActions';

const ConfirmationModal = React.createClass({

  propTypes: {
    prompt: React.PropTypes.string.isRequired,
    cb: React.PropTypes.func.isRequired
  },

  handleConfirmation() {
    this.props.cb();
    GlobalActions.closeModal();
  },

  render() {
    return (
      <div>
        <h5 className="nudge--bottom">{prompt}</h5>

        <div className="pure-g">
          <div className="pure-u-1-2 soft-half--right">
            <button type="button" className="btn red full" onClick={this.handleConfirmation}>Yes</button>
          </div>
          <div className="pure-u-1-2 soft-half--left">
            <button type="button" className="btn full" onClick={GlobalActions.closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

});

export default ConfirmationModal;
