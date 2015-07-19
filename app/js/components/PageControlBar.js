'use strict';

var React = require('react/addons');
var cx    = require('classnames');

var PageControlBar = React.createClass({

  propTypes: {
    type: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      type: 'playlist'
    };
  },

  render: function() {
    var classes = {
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

module.exports = PageControlBar;