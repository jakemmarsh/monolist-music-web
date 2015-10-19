'use strict';

import React                from 'react';
import ReactDOM             from 'react-dom';
import {Router}             from 'react-router';
import CreateBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory';

import Routes               from './Routes';

ReactDOM.render((
  <Router history={CreateBrowserHistory()} routes={Routes} />
), document.getElementById('app'));