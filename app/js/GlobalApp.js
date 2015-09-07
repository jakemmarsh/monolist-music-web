/* global FB */
'use strict';

import React from 'react/addons';

var GlobalApp = React.createClass({

  propTypes: {
    children: React.PropTypes.object.isRequired
  },

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

        {this.props.children}

      </div>
    );
  }

});

export default GlobalApp;