'use strict';

import React    from 'react';
import _        from 'lodash';

import ListLink from './ListLink';
import navLinks from '../data/nav_links';

var NavigationSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  renderLinks() {
    return _.map(navLinks, (link, index) => {
      if ( !link.requiresUser || !_.isEmpty(this.props.currentUser) ) {
        return (
          <ListLink to={link.path} key={index}>
            <div className="icon-container">
              <i className={'fa ' + link.icon}></i>
            </div>
            <div className="text-container">
              {link.text}
            </div>
          </ListLink>
        );
      }
    });
  },

  render() {
    return (
      <nav className="sidebar left fx-1 ord-1 miw-200 ovy-a">

        <ul>
          {this.renderLinks()}
        </ul>

        <div className="shadow" />

      </nav>
    );
  }

});

export default NavigationSidebar;