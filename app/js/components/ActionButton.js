'use strict';

import React from 'react';
import cx    from 'classnames';

const ActionButton = React.createClass({

  propTypes: {
    icon: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    tooltip: React.PropTypes.string,
    className: React.PropTypes.string
  },

  getInitialState() {
    return {
      showTooltip: false
    };
  },

  handleMouseEnter() {
    this.setState({
      showTooltip: true
    });
  },

  handleMouseLeave() {
    this.setState({
      showTooltip: false
    });
  },

  renderTooltip() {
    if ( this.state.showTooltip && this.props.tooltip ) {
      return (
        <div ref="tooltip" className="action-button-tooltip">
          {this.props.tooltip}
        </div>
      );
    }
  },

  render() {
    const classes = cx('btn', 'action-button', {
      [this.props.className]: !!this.props.className
    });

    return (
      <div className={classes}
           onMouseEnter={this.props.tooltip ? this.handleMouseEnter : null}
           onMouseLeave={this.props.tooltip ? this.handleMouseLeave : null}
           onClick={this.props.onClick}>
        <i ref="icon" className={`icon-${this.props.icon}`} />
        {this.renderTooltip()}
      </div>
    );
  }

});

export default ActionButton;
