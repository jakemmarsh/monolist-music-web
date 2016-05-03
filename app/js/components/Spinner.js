'use strict';

import React from 'react';
import cx    from 'classnames';

const Spinner = React.createClass({

  propTypes: {
    size: React.PropTypes.number,
    className: React.PropTypes.string
  },

  render() {
    const classes = cx('spinner', {
      [this.props.className]: !!this.props.className
    });
    const bounceStyle = {
      height: this.props.size,
      width: this.props.size
    };

    return (
      <div className={classes}>
        <div className="spinner-ball bounce1" style={bounceStyle}></div>
        <div className="spinner-ball bounce2" style={bounceStyle}></div>
        <div className="spinner-ball bounce3" style={bounceStyle}></div>
      </div>
    );
  }

});

export default Spinner;
