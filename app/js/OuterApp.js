'use strict';

import React               from 'react/addons';
import {RouteHandlerMixin} from 'react-router';

import Footer              from './components/Footer';

var OuterApp = React.createClass({

  mixins: [RouteHandlerMixin],

  render() {
    let RouteHandler = this.createChildRouteHandler({
      params: this.props.params,
      query: this.props.query
    });

    return (
      <div className="outer-page">

        <div className="outer-header soft-half--ends">
          <img className="logo" src="https://assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends">
          {RouteHandler}
        </div>

        <Footer />

      </div>
    );
  }

});

export default OuterApp;