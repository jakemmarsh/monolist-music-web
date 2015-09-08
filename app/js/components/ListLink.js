'use strict';

import React         from 'react/addons';
import {State, Link} from 'react-router';

var ListLink = React.createClass({

  mixins: [State],

  render() {
    let isActive = this.isActive(this.props.to, this.props.query);
    let className = isActive ? 'active' : '';

    return (
      <li className={className}>
        <Link {...this.props} />
      </li>
    );
  }

});

export default ListLink;