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
          <Link to="explore">
            <li className="link">
                <div className="icon-container">
                  <i className="fa fa-compass"></i>
                </div>
                <div className="text-container">
                  Explore
                </div>
            </li>
          </Link>
          <Link to="playlists">
            <li className="link">
                <div className="icon-container">
                  <i className="fa fa-list"></i>
                </div>
                <div className="text-container">
                  Playlists
                </div>
            </li>
          </Link>
          <Link to="search">
            <li className="link">
                <div className="icon-container">
                  <i className="fa fa-search"></i>
                </div>
                <div className="text-container">
                  Search
                </div>
            </li>
          </Link>
        </ul>
      </nav>
    );
  }

});

module.exports = NavigationSidebar;