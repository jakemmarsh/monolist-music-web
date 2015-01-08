/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var cx    = React.addons.classSet;

var PageControlBar = React.createClass({

  propTypes: {
    type: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      type: 'playlist'
    };
  },

  render: function() {
    var classes = cx({
      'list-controls-container': true,
      'search': this.props.type === 'search',
      'playlist': this.props.type === 'playlist'
    });

    return (
      <div className={classes}>

        {this.props.children}

      </div>
    );
  }

});

module.exports = React.createFactory(PageControlBar);