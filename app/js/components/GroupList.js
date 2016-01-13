'use strict';

import React     from 'react';
import _         from 'lodash';

import GroupCard from './GroupCard';

var GroupList = React.createClass({

  propTypes: {
    groups: React.PropTypes.array,
    className: React.PropTypes.string,
    cardClassName: React.PropTypes.string,
    firstItem: React.PropTypes.element
  },

  getDefaultProps() {
    return {
      groups: [],
      cardClassName: null
    };
  },

  renderGroups() {
    let elements = null;

    if ( !_.isEmpty(this.props.groups) || this.props.firstItem ) {
      elements = _.map(this.props.groups, (group, index) => {
        return (
          <li className={this.props.cardClassName} key={index}>
            <GroupCard group={group} />
          </li>
        );
      });

      if ( this.props.firstItem ) {
        elements.unshift(
          <li className={this.props.cardClassName} key={this.props.groups.length}>
            {this.props.firstItem}
          </li>
        );
      }
    } else {
      elements = (
        <h3 className="flush--top light">No groups yet!</h3>
      );
    }

    return elements;
  },

  render() {
    let classes = 'group-list pure-g';

    if ( this.props.className ) {
      classes += (' ' + this.props.className);
    }
    return (
      <ul className={classes}>

        {this.renderGroups()}

      </ul>
    );
  }

});

export default GroupList;