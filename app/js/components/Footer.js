'use strict';

import React            from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {History}        from 'react-router';

import ListLink         from './ListLink';
import SearchBar        from './SearchBar';

var Footer = React.createClass({

  mixins: [LinkedStateMixin, History],

  propTypes: {
    currentUser: React.PropTypes.object,
    shouldPosition: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      currentUser: {},
      shouldPosition: false
    };
  },

  getInitialState() {
    return {
      query: ''
    };
  },

  handleKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch() {
    this.history.pushState(null, `/search/tracks`, { q: this.state.query });

    this.setState({ query: '' }, () => {
      this.refs.SearchBar.refs.input.blur();
    });
  },

  render() {
    return (
      <footer>
        <div className="logo-container">
          <img src="../images/logo.png" className="logo" />
        </div>

        <div className="links-container">
          <ul>
            <ListLink to="/explore">
              Explore
            </ListLink>
            <ListLink to="/groups">
              Groups
            </ListLink>
            <ListLink to="/search/tracks">
              Search Tracks
            </ListLink>
          </ul>
        </div>

        <div className="links-container">
          <ul>
            <li>
              <a href="//monolist.co/privacy" target="_blank">Privacy Policy</a>
            </li>
            <li>
              <a href="//monolist.co/contact" target="_blank">Contact</a>
            </li>
          </ul>
        </div>

        <div className="search-container">
          <SearchBar ref="SearchBar"
                     valueLink={this.linkState('query')}
                     onKeyPress={this.handleKeyPress}
                     placeholder="Search Monolist..." />
          <a href="https://mixpanel.com/f/partner" target="_blank" rel="nofollow" className="block nudge-half--top">
            <img src="//cdn.mxpnl.com/site_media/images/partner/badge_blue.png" alt="Mobile Analytics" />
          </a>
        </div>
      </footer>
    );
  }

});

export default Footer;