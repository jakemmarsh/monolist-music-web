'use strict';

import React           from 'react';
import {Link, History} from 'react-router';

var ListLink = React.createClass({

  mixins: [History],

  propTypes: {
    to: React.PropTypes.string,
    query: React.PropTypes.object
  },

  render() {
    let className = this.history.isActive(this.props.to) ? 'active' : '';

    return (
      <li className={className}>
        <Link {...this.props} />
      </li>
    );
  }

});

export default ListLink;