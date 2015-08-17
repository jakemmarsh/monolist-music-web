'use strict';

import React from 'react/addons';

var Title = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string
  },

  renderIcon() {
    if ( this.props.icon ) {
      return (
        <div className="icon-container">
          <i className={'icon-' + this.props.icon} />
        </div>
      );
    }
  },

  render() {
    return (
      <div className="title-container">
        {this.renderIcon()}
        <h5 className="title">{this.props.text}</h5>
      </div>
    );
  }

});

export default Title;