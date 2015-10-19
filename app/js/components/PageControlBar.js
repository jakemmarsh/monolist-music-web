'use strict';

import React from 'react';
import cx    from 'classnames';

var PageControlBar = React.createClass({

  propTypes: {
    type: React.PropTypes.string,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      type: 'playlist'
    };
  },

  render() {
    let classes = {
      'list-controls-container': true,
      'search': this.props.type === 'search',
      'playlist': this.props.type === 'playlist'
    };

    if ( this.props.className ) {
      classes[this.props.className] = true;
    }

    return (
      <div className={cx(classes)}>

        {this.props.children}

      </div>
    );
  }

});

export default PageControlBar;