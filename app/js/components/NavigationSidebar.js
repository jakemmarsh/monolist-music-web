/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var NavigationSidebar = React.createClass({

  render: function() {
    return (
      <nav className="sidebar left">
        <ul>
          <Link to="Explore">
            <li className="link">
                <div className="icon-container">
                  <i className="fa fa-compass"></i>
                </div>
                <div className="text-container">
                  Explore
                </div>
            </li>
          </Link>
          <Link to="Playlists">
            <li className="link">
                <div className="icon-container">
                  <i className="fa fa-list"></i>
                </div>
                <div className="text-container">
                  Playlists
                </div>
            </li>
          </Link>
          <Link to="TrackSearch">
            <li className="link">
                <div className="icon-container">
                  <i className="fa fa-search"></i>
                </div>
                <div className="text-container">
                  Search Tracks
                </div>
            </li>
          </Link>
        </ul>
      </nav>
    );
  }

});

module.exports = NavigationSidebar;