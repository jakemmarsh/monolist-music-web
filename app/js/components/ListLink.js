'use strict';

import React    from 'react/addons';
import {Link}   from 'react-router';
import isActive from 'react-router/lib/isActive';

var ListLink = React.createClass({

  propTypes: {
    to: React.PropTypes.string.isRequired,
    query: React.PropTypes.object
  },

  render() {
    let className = isActive(this.props.to, this.props.query) ? 'active' : '';

    return (
      <li className={className}>
        <Link {...this.props} />
      </li>
    );
  }

});

export default ListLink;