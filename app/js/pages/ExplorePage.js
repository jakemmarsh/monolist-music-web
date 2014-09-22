/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var ExplorePage = React.createClass({

  componentDidMount: function() {
    this.props.updateHeader({
      title: 'Explore',
      icon: 'fa-compass',
      onPlaylist: false
    });
  },

  render: function() {
    return (
      <section className="content">

        <Link to="user" params={{username: 'jakemmarsh'}} user={{username: 'jakemmarsh'}}>Go to profile</Link>

        <br />

        <Link to="playlist" params={{id: 1}}>Go to playlist</Link>

      </section>
    );
  }

});

module.exports = ExplorePage;