'use strict';

import React        from 'react';
import {Navigation} from 'react-router';

import ListLink     from './ListLink';
import SearchBar    from './SearchBar';

var Footer = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      currentUser: {}
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
      this.doPlaylistSearch();
    }
  },

  doPlaylistSearch() {
    this.transitionTo('PlaylistSearch', {}, { q: this.state.query });

    this.setState({ query: '' }, () => {
      this.refs.SearchBar.refs.input.getDOMNode().blur();
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
            <ListLink to="Explore">
              Explore
            </ListLink>
            <ListLink to="Groups">
              Groups
            </ListLink>
            <ListLink to="TrackSearch">
              Search Tracks
            </ListLink>
          </ul>
        </div>

        <div className="links-container">
          <ul>
            <ListLink to="Explore">About</ListLink>
            <ListLink to="Explore">Privacy Policy</ListLink>
            <ListLink to="Explore">Contact</ListLink>
          </ul>
        </div>

        <div className="search-container">
          <SearchBar ref="SearchBar"
                     valueLink={this.linkState('query')}
                     onKeyPress={this.handleKeyPress}
                     placeholder="Search all playlists..." />
        </div>
      </footer>
    );
  }

});

export default Footer;