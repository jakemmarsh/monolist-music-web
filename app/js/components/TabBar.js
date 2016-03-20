'use strict';

import React from 'react';
import cx    from 'classnames';

const TabBar = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.node
  },

  render() {
    let classes = {
      'tabs': true
    };

    if ( this.props.className ) {
      classes[this.props.className] = true;
    }

    classes = cx(classes);

    return (
      <ul className={classes}>
        {this.props.children}
      </ul>
    );
  }

});

export default TabBar;
