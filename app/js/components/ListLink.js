'use strict';

import React         from 'react/addons';
import {State, Link} from 'react-router';

var ListLink = React.createClass({

  mixins: [State],

  render() {
    let isActive = this.isActive(this.props.to, this.props.params, this.props.query);
    let className = isActive ? 'active' : '';
    let link = Link(this.props);

    return <li className={className}>{link}</li>;
  }

});

export default ListLink;