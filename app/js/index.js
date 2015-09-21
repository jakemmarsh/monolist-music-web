'use strict';

import React                from 'react/addons';
import {Router}             from 'react-router';
import CreateBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory';

import Routes               from './Routes';

React.render((
  <Router history={CreateBrowserHistory()} routes={Routes} />
), document.getElementById('app'));