'use strict';

import React  from 'react';
import {Link} from 'react-router';

const ListLink = React.createClass({

  propTypes: {
    to: React.PropTypes.string.isRequired,
    query: React.PropTypes.object
  },

  getCurrentPath() {
    return window.location.pathname;
  },

  render() {
    const className = this.getCurrentPath() === this.props.to ? 'active' : '';

    return (
      <li ref="listItem" className={className}>
        <Link {...this.props} />
      </li>
    );
  }

});

export default ListLink;
