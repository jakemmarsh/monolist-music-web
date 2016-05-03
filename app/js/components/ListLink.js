'use strict';

import React           from 'react';
import {Link, History} from 'react-router';

const ListLink = React.createClass({

  mixins: [History],

  propTypes: {
    to: React.PropTypes.string,
    query: React.PropTypes.object
  },

  render() {
    const className = this.history.isActive(this.props.to) ? 'active' : '';

    return (
      <li className={className}>
        <Link {...this.props} />
      </li>
    );
  }

});

export default ListLink;
