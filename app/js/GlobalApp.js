/* global FB */
'use strict';

import React from 'react/addons';

var GlobalApp = React.createClass({

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object
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

  renderChildren() {
    return React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.location.query
    });
  },

  render() {
    return (
      <div className="full-height">

        {this.renderChildren()}

      </div>
    );
  }

});

export default GlobalApp;