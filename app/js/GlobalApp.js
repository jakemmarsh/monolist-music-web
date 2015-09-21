/* global FB, JSLogger */
'use strict';

import React          from 'react/addons';
import {RouteHandler} from 'react-router';

var GlobalApp = React.createClass({

  _initFb() {
    if ( typeof FB !== 'undefined' ) {
      FB.init({
        appId: '1096019800427148',
        xfbml: true,
        version: 'v2.2'
      });
    }
  },

  _initLogger() {
    if ( typeof JSLogger !== 'undefined' ) {
      window.jslogger = new JSLogger();
    }
  },

  componentWillMount() {
    this._initFb();
    this._initLogger();
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