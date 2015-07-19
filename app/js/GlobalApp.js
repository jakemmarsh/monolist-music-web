'use strict';

import React          from 'react/addons';
import {RouteHandler} from 'react-router';

var GlobalApp = React.createClass({

  componentWillMount() {
    FB.init({
      appId   : '619396928089440',
      xfbml   : true,
      version : 'v2.2'
    });
  },

  render() {
    return (
      <div className="full-height">

        <RouteHandler params={this.props.params} query={this.props.query} />

      </div>
    );
  }

});

export default GlobalApp;