'use strict';

import React                   from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import cx                      from 'classnames';

import Animations              from '../utils/Animations';

const GlobalActionIndicator = React.createClass({

  propTypes: {
    isSuccess: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      isSuccess: true
    };
  },

  _animateOut(cb) {
    Animations.fadeOut(this.refs.indicator, 300).then(cb);
  },

  componentDidMount() {
    // Manually fade out after 1200ms. Component unmounted after 2000ms
    setTimeout(this._animateOut, 1200);
  },

  render() {
    const indicatorClasses = cx({
      'global-action-indicator': true,
      'global-action-indicator-error': !this.props.isSuccess
    });
    const iconClasses = cx({
      'icon-check': this.props.isSuccess,
      'icon-close': !this.props.isSuccess
    });

    return (
      <ReactCSSTransitionGroup transitionName="action-indicator"
                               transitionAppear={true}
                               transitionAppearTimeout={300}
                               transitionEnterTimeout={300}
                               transitionLeaveTimeout={300}>
        <div className={indicatorClasses} key={0} ref="indicator">
          <i className={iconClasses} />
        </div>
      </ReactCSSTransitionGroup>
    );
  }

});

export default GlobalActionIndicator;
