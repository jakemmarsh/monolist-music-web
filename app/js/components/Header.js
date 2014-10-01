/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var Link         = require('react-router').Link;
var transitionTo = require('react-router').transitionTo;

var SearchBar    = require('./SearchBar');
var Avatar       = require('./Avatar');

var Header = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    user: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      query: ''
    };
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch: function() {
    transitionTo('PlaylistSearch', {}, { q: this.state.query });

    this.setState({
      query: ''
    }, function() {
      this.refs.SearchBar.refs.input.getDOMNode().blur();
    });
  },

  render: function() {
    return (
      <header>

        <div className="logo-container">
          <Link to="Home">
            <img className="logo" src="../images/logo.png" alt="Monolist logo" />
          </Link>
        </div>

        <div className="search-container">
          <SearchBar ref="SearchBar"
                     valueLink={this.linkState('query')}
                     onKeyPress={this.submitOnEnter}
                     placeholder="Search all playlists..." />
        </div>

        <div className="user-options-container">
          <div className="dropdown-toggle-container">
            <div className="avatar-container">
              <Avatar user={this.props.user} />
              <span className="username">jakemmarsh</span>
            </div>
            <div className="arrow-container">
              <i className="fa fa-chevron-down"></i>
            </div>
          </div>
        </div>

      </header>
    );
  }

});

module.exports = Header;