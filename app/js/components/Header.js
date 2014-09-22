/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react/addons');
var Link      = require('react-router').Link;

var SearchBar = require('./SearchBar');

var Header = React.createClass({

  getInitialState: function() {
    return {
      query: ''
    };
  },

  updateQuery: function(evt) {
    this.setState({
      query: evt.target.value
    });
  },

  renderIcon: function() {
    var element;
    var iconClasses;

    if ( this.props.icon ) {
      iconClasses = 'fa ' + this.props.icon;
      element = (
        <div className="icon-container">
          <i className={iconClasses}></i>
        </div>
      );
    } else {
      element = null;
    }

    return element;
  },

  renderTitle: function() {
    var element;

    if ( this.props.title ) {
      element = (
        <div>
          <h5 className="title">{this.props.title}</h5>
          {this.renderIcon()}
        </div>
      );
    } else {
      element = null;
    }

    return element;
  },

  render: function() {
    return (
      <header>

        <div className="logo-container">
          <Link to="home">
            <img className="logo" src="../images/logo.png" alt="Monolist logo" />
          </Link>
        </div>

        <div className="title-container">
          {this.renderTitle()}
        </div>

        <div className="search-container">
          <SearchBar value={this.state.query}
                     onChange={this.updateQuery}
                     placeholder="Search all music..." />
        </div>

      </header>
    );
  }

});

module.exports = Header;