'use strict';

import React  from 'react/addons';
import Router from 'react-router';
import routes from './Routes';

window.React = React; // Enable React devtools

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(<Handler params={state.params} query={state.query} />, document.getElementById('app'));
});