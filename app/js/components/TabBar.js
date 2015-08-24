'use strict';

import React from 'react/addons';
import cx    from 'classnames';

var TabBar = React.createClass({

  propTypes: {
    className: React.PropTypes.string
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