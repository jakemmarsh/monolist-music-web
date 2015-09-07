'use strict';

import React  from 'react/addons';
import Router from 'react-router';
import Routes from './Routes';

if ( process.env.NODE_ENV !== 'production' ) {
  window.React = React; // Enable React devtools
}

React.render(Routes, document.getElementById('app'));