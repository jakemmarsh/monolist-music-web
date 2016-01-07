'use strict';

import React           from 'react';
import ReactDOM        from 'react-dom';
import {Router}        from 'react-router';
import {createHistory} from 'history';

import Routes          from './Routes';

ReactDOM.render((
  <Router history={createHistory()} routes={Routes} />
), document.getElementById('app'));