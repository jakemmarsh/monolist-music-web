/* global FB */
'use strict';

import React          from 'react/addons';
import {RouteHandler} from 'react-router';

var GlobalApp = React.createClass({

  componentWillMount() {
    if ( typeof FB !== 'undefined' ) {
      FB.init({
        appId: '1096019800427148',
        xfbml: true,
        version: 'v2.2'
      });
    }
  },

  render() {
    return (
      <div className="full-height">

        <RouteHandler {...this.props} />

      </div>
    );
  }

});

export default GlobalApp;