'use strict';

import React          from 'react/addons';
import {RouteHandler} from 'react-router';

var GlobalApp = React.createClass({

  render() {
    return (
      <div>

        <RouteHandler params={this.props.params} query={this.props.query} />

      </div>
    );
  }

});

export default GlobalApp;