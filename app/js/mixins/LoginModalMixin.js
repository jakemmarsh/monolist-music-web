 /* global FB */
'use strict';

import React         from 'react';

import LoginForm     from '../components/LoginForm';
import GlobalActions from '../actions/GlobalActions';

const LoginModalMixin = {

  openLoginModal() {
    GlobalActions.openModal('login',
      <LoginForm onLogin={GlobalActions.closeModal} />
    );
  }

};

export default LoginModalMixin;
