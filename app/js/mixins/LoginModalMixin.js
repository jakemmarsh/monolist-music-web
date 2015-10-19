 /* global FB */
'use strict';

import React                 from 'react';

import LayeredComponentMixin from './LayeredComponentMixin';
import Modal                 from '../components/Modal';
import LoginForm             from '../components/LoginForm';

var LoginModalMixin = {

  mixins: [LayeredComponentMixin],

  getInitialState() {
    return {
      showLoginModal: false
    };
  },

  toggleLoginModal() {
    this.setState({ showLoginModal: !this.state.showLoginModal }, () => {
      if ( !this.state.showLoginModal ) {
        this.setState(this.getInitialState());
      }
    });
  },

  handleLogin() {
    this.setState({ showLoginModal: false });
  },

  renderLayer() {
    let element = (<span />);

    if ( this.state.showLoginModal ) {
      element = (
        <Modal className="share" onRequestClose={this.toggleLoginModal}>

          <LoginForm onLogin={this.handleLogin} />

        </Modal>
      );
    }

    return element;
  },

};

export default LoginModalMixin;