'use strict';

import React         from 'react';

import GlobalActions from '../actions/GlobalActions';

var Modal = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.object
  },

  killClick(e) {
    // clicks on the content shouldn't close the modal
    e.stopPropagation();
  },

  handleCloseClick() {
    // when you click the background, the user is requesting that the modal gets closed.
    // note that the modal has no say over whether it actually gets closed. the owner of the
    // modal owns the state. this just "asks" to be closed.
    GlobalActions.closeModal();
  },

  render() {
    let modalClasses = 'modal' + (this.props.className ? ' ' + this.props.className : '');

    return (
      <div className="modal-backdrop" onClick={this.handleCloseClick}>
        <div className="modal-container">
          <div className={modalClasses} onClick={this.killClick}>
            {this.props.children}
            <div className="close-button" onClick={this.handleCloseClick}>
              <i className="icon-close" />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

export default Modal;