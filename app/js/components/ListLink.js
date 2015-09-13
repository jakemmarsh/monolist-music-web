'use strict';

import React           from 'react/addons';
import {Link, History} from 'react-router';

var ListLink = React.createClass({

  mixins: [History],

  propTypes: {
    to: React.PropTypes.string,
    query: React.PropTypes.object
  },

  render() {
    let className = this.history.isActive(this.props.to, this.props.query) ? 'active' : '';

    return (
      <li className={className}>
        <Link {...this.props} />
      </li>
    );
  }

});

export default ListLink;