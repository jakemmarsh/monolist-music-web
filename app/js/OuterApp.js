'use strict';

import React          from 'react/addons';
import {RouteHandler} from 'react-router';

var OuterApp = React.createClass({

  render() {
    return (
      <div className="outer-page">

        <div className="outer-header soft-half--ends">
          <img className="logo" src="https://assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends">
          <RouteHandler params={this.props.params} query={this.props.query} />
        </div>

      </div>
    );
  }

});

export default OuterApp;