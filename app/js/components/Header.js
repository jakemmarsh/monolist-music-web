/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var $            = require('jquery');
var Link         = require('react-router').Link;
var transitionTo = require('react-router').transitionTo;

var SearchBar    = require('./SearchBar');
var Avatar       = require('./Avatar');
var DropdownMenu = require('./DropdownMenu');

var cx           = React.addons.classSet;

var Header = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    user: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      query: '',
      displayUserDropdown: false
    };
  },

  componentDidMount: function() {
    var $dropdownToggle = $(this.refs.dropdownToggle.getDOMNode());
    var left = $dropdownToggle.position().left;
    var bottom = $dropdownToggle.position().top + $dropdownToggle.outerHeight(true);
    var width = $dropdownToggle.outerWidth(true);

    this.dropdownToggleLeft = left;
    this.dropdownToggleBottom = bottom;
    this.dropdownToggleWidth = width;
  },

  toggleUserDropdown: function() {
    this.setState({
      displayUserDropdown: !this.state.displayUserDropdown
    });
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

  renderUserDropdown: function() {
    var element = null;

    if ( this.state.displayUserDropdown ) {
      element = (
        <DropdownMenu left={this.dropdownToggleLeft} top={this.dropdownToggleBottom} width={this.dropdownToggleWidth}>
          <li>
            <i className="fa fa-cogs"></i>
            Account Settings
          </li>
          <li>
            <i className="fa fa-sign-out"></i>
            Sign Out
          </li>
        </DropdownMenu>
      );
    }

    return element;
  },

  render: function() {
    var dropdownToggleClassess = cx({
      'dropdown-toggle-container': true,
      'active': this.state.displayUserDropdown
    });

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
          <div ref="dropdownToggle" className={dropdownToggleClassess} onClick={this.toggleUserDropdown}>
            <div className="avatar-container">
              <Avatar user={this.props.user} />
              <span className="username">jakemmarsh</span>
            </div>
            <div className="arrow-container">
              <i className="fa fa-chevron-down"></i>
            </div>
          </div>
          {this.renderUserDropdown()}
        </div>

      </header>
    );
  }

});

module.exports = Header;