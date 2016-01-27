'use strict';

import React           from 'react';
import ReactDOM        from 'react-dom';
import {Router}        from 'react-router';
import {createHistory} from 'history';

import Routes          from './Routes';

window.nodeEnv = document.documentElement.getAttribute('data-env');

if ( window.Rollbar && window.nodeEnv === 'development' ) {
  // Don't log JS errors in development mode
  window.Rollbar.configure({ enabled: false });
}

ReactDOM.render((
  <Router history={createHistory()} routes={Routes} />
), document.getElementById('app'));
