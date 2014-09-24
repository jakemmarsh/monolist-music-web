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
      icon: 'fa-compass'
    });
  },

  render: function() {
    return (
      <section className="content">

        <div className="title-container">
          <h5 className="title">Example User</h5>
          <div className="icon-container">
            <i className="fa fa-user"></i>
          </div>
        </div>

        <Link to="user" params={{username: 'jakemmarsh'}} user={{username: 'jakemmarsh'}}>Go to profile</Link>

        <div className="title-container">
          <h5 className="title">Example Playlist</h5>
          <div className="icon-container">
            <i className="fa fa-list"></i>
          </div>
        </div>

        <Link to="playlist" params={{id: 1}}>Go to playlist</Link>

      </section>
    );
  }

});

module.exports = ExplorePage;