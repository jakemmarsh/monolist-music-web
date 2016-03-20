'use strict';

import React from 'react';

const NoDataBlock = React.createClass({

  propTypes: {
    iconClass: React.PropTypes.string,
    heading: React.PropTypes.string,
    subheading: React.PropTypes.string
  },

  renderSubheading() {
    if ( this.props.subheading ) {
      return (
        <h6 className="nudge-quarter--top">{this.props.subheading}</h6>
      );
    }
  },

  render() {
    return (
      <div className="no-data-block island text-center nudge--top">
        <div className="icon-container nudge-half--bottom">
          <i className={'no-data-block-icon ' + this.props.iconClass} />
        </div>
        <div className="text-container">
          <h3 className="nudge-quarter--bottom">{this.props.heading}</h3>
          {this.renderSubheading()}
        </div>
      </div>
    );
  }

});

export default NoDataBlock;
