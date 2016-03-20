'use strict';

import React from 'react';

const Spinner = React.createClass({

  propTypes: {
    size: React.PropTypes.number
  },

  render() {
    const bounceStyle = {
      height: this.props.size,
      width: this.props.size
    };

    return (
      <div className="spinner">
        <div className="bounce1" style={bounceStyle}></div>
        <div className="bounce2" style={bounceStyle}></div>
        <div className="bounce3" style={bounceStyle}></div>
      </div>
    );
  }

});

export default Spinner;
