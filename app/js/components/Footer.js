'use strict';

import React        from 'react';
import $            from 'jquery';
import {Navigation} from 'react-router';

import ListLink     from './ListLink';
import SearchBar    from './SearchBar';

var Footer = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

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

  _doPositioning() {
    if ( this.props.shouldPosition ) {
      let documentHeight = $(document).outerHeight();
      let $footer = $(this.getDOMNode());
      let footerTop = $footer.offset().top;
      let footerHeight = $footer.outerHeight();

      if ( footerTop + footerHeight < documentHeight ) {
        $footer.css({
          position: 'absolute',
          bottom: '0'
        });
      } else if ( $footer.css('position') === 'absolute' ) {
        $footer.css({
          position: 'relative',
          bottom: 'auto'
        });
      }
    }
  },

  componentDidUpdate() {
    this._doPositioning();
  },

  componentDidMount() {
    $(window).resize(this._doPositioning.bind(this));
    this._doPositioning();
  },

  handleKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch() {
    this.transitionTo('TrackSearch', {}, { q: this.state.query });

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
            <li>
              <a href="//monolist.co/about" target="_blank">About</a>
            </li>
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
        </div>
      </footer>
    );
  }

});

export default Footer;