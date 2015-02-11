/**
 * @jsx React.DOM
 */
'use strict';

var React              = require('react/addons');
var $                  = require('jquery');
var Navigation         = require('react-router').Navigation;
var cx                 = React.addons.classSet;

var UserActions        = require('../actions/UserActions');
var SearchBar          = require('./SearchBar');
var NotificationCenter = require('./NotificationCenter');
var Avatar             = require('./Avatar');

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
    this.setState({ displayUserDropdown: !this.state.displayUserDropdown });
  },

  logoutUser: function() {
    UserActions.logout(function() {
      this.transitionTo('Login');
    }.bind(this));
  },

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch: function() {
    this.transitionTo('PlaylistSearch', {}, { q: this.state.query });

    this.setState({ query: '' }, function() {
      this.refs.SearchBar.refs.input.getDOMNode().blur();
    }.bind(this));
  },

  showUserDropdownMenu: function(e) {
    var menuItems = (
      <div>
        <li>
          <i className="fa fa-sign-out"></i>
          Sign Out
          <a onClick={this.logoutUser} />
        </li>
      </div>
    );
    var $dropdownToggle = $(this.refs.dropdownToggle.getDOMNode());
    var width = $dropdownToggle.outerWidth(true);
    var top = $dropdownToggle.offset().top + $dropdownToggle.outerHeight(true);
    var left = $dropdownToggle.offset().left;

    e.stopPropagation();
    e.preventDefault();

    e.pageX = left;
    e.pageY = top;

    this.props.showContextMenu(e, menuItems, width);
  },

  render: function() {
    var dropdownToggleClassess = cx({
      'dropdown-toggle-container': true,
      'active': this.state.displayUserDropdown
    });

    return (
      <header>

        <div className="back-arrow-container text-center">
          <i className="fa fa-arrow-left back-arrow" onClick={this.goBack} />
        </div>

        <div className="search-container soft-quarter--sides">
          <SearchBar ref="SearchBar"
                     valueLink={this.linkState('query')}
                     onKeyPress={this.handleKeyPress}
                     placeholder="Search all playlists..." />
        </div>

        <div className="user-options-container">
          <div ref="dropdownToggle" className={dropdownToggleClassess} onClick={this.showUserDropdownMenu}>
            <div className="avatar-container">
              <Avatar user={this.props.currentUser} />
              <span className="username">{this.props.currentUser.username}</span>
            </div>
            <div className="arrow-container">
              <i className="fa fa-chevron-down"></i>
            </div>
          </div>
          <NotificationCenter className="nudge-half--right float-right" currentUser={this.props.currentUser} />
        </div>

      </header>
    );
  }

});

module.exports = React.createFactory(Header);