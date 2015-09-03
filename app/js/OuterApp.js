'use strict';

import React          from 'react/addons';
import {RouteHandler} from 'react-router';

import Footer         from './components/Footer';

var OuterApp = React.createClass({

  render() {
    return (
      <div className="outer-page">

        <div className="outer-header soft-half--ends">
          <img className="logo" src="//assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends">
          <RouteHandler {...this.props} />
        </div>

        <Footer shouldPosition={true} />

      </div>
    );
  }

});

export default OuterApp;