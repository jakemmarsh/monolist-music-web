/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var Link         = React.createFactory(require('react-router').Link);
var Navigation   = require('react-router').Navigation;

var SearchBar    = require('./SearchBar');
var Avatar       = require('./Avatar');
var DropdownMenu = require('./DropdownMenu');

var cx           = React.addons.classSet;

var Header = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialState: function() {
    return {
      query: '',
      displayUserDropdown: false
    };
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
    this.transitionTo('PlaylistSearch', {}, { q: this.state.query });

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
        <DropdownMenu left={0} top="100%" width="100%">
          <li>
            <i className="fa fa-user"></i>
            My Profile
            <Link to="Profile" params={{ username: this.props.currentUser.username }} />
          </li>
          <li>
            <i className="fa fa-cogs"></i>
            Account Settings
            <Link to="Settings" />
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
          <Link to="Explore">
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
              <Avatar user={this.props.currentUser} />
              <span className="username">{this.props.currentUser.username}</span>
            </div>
            <div className="arrow-container">
              <i className="fa fa-chevron-down"></i>
            </div>
            {this.renderUserDropdown()}
          </div>
        </div>

      </header>
    );
  }

});

module.exports = React.createFactory(Header);