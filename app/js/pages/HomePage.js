/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var HomePage = React.createClass({

  componentDidMount: function() {
    this.props.updateHeader({
      title: null,
      icon: null,
      onPlaylist: false
    });
  },

  render: function() {
    return (
      <div>

        <Link to="user" params={{username: 'jakemmarsh'}} user={{username: 'jakemmarsh'}}>Go to profile</Link>

        <br />

        <Link to="playlist" params={{id: 1}}>Go to playlist</Link>

      </div>
    );
  }

});

module.exports = HomePage;