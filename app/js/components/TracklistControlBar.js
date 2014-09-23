/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var cx    = React.addons.classSet;

var TracklistControlBar = React.createClass({

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

module.exports = TracklistControlBar;