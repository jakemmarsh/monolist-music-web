'use strict';

import React  from 'react';
import {Link} from 'react-router';

class ListLink extends React.Component {
  constructor(props) {
    super(props);
    this.getCurrentPath = this.getCurrentPath.bind(this);
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  render() {
    const className = this.getCurrentPath() === this.props.to ? 'active' : '';

    return (
      <li ref="listItem" className={className}>
        <Link {...this.props} />
      </li>
    );
  }
}

ListLink.propTypes = {
  to: React.PropTypes.string.isRequired,
  query: React.PropTypes.object
};

export default ListLink;
