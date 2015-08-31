'use strict';

import React     from 'react/addons';
import Router    from 'react-router';
import Analytics from './Analytics';
import routes    from './Routes';

if ( process.env.NODE_ENV !== 'production' ) {
  window.React = React; // Enable React devtools
}

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(<Handler {...state} />, document.getElementById('app'));
  Analytics.send(state);
});