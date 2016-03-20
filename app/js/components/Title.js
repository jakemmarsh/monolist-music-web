'use strict';

import React from 'react';

const Title = React.createClass({

  propTypes: {
    text: React.PropTypes.string,
    icon: React.PropTypes.string,
    className: React.PropTypes.string
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
    let classes = 'title-container';

    if ( this.props.className ) {
      classes = classes + ' ' + this.props.className;
    }

    return (
      <div className={classes}>
        {this.renderIcon()}
        <h5 className="title">{this.props.text}</h5>
      </div>
    );
  }

});

export default Title;
